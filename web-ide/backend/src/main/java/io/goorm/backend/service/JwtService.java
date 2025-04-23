package io.goorm.backend.service;

import io.goorm.backend.dto.auth.JwtUserInfoDto;
import io.goorm.backend.global.exception.UserNotFoundException;
import io.goorm.backend.security.CustomUserDetails;
import io.goorm.backend.service.auth.RedisService;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.time.ZonedDateTime;
import java.util.Date;

/**
 * JWT 서비스
 *
 * JWT 토큰 생성, 검증, 갱신
 * Access/Refresh 토큰을 생성, 유효성 검증과 사용자 정보 추출, Redis에 Refresh 토큰 저장 및 재발급
 */
@Service
@Slf4j
public class JwtService {
    private final Key key; // Access Token 서명용 비밀 키
    private final Key refreshKey; // Refresh Token 서명용 비밀 키
    private final RedisService redisService; // Redis 서비스 (Redis에 refresh token 저장/조회 용도)
    private final long accessTokenExpireTime; // Access Token 만료시간
    private final long refreshTokenExpireTime; // Refresh Token 만료시간

    private static final long ONE_SECOND = 1000;
    private static final long ONE_MINUTE = ONE_SECOND * 60;
    private static final String USERNAME_KEY = "user_id"; // 토큰의 Claims에 담을 사용자 식별자 키
    private static final String ROLE_KEY = "role"; // 토큰의 Claims에 담을 사용자 권한 키
    private static final String INVALID_TOKEN_MESSAGE = "INVALID_TOKEN"; // 공통 에러 메시지

    public JwtService(@Value("${jwt.secret}") String secretKey,
                      @Value("${jwt.refresh_secret}") String refreshSecretKey,
                      @Value("${jwt.expiration_time}") long accessTokenExpiresTime,
                      RedisService redisService) {
        this.key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(secretKey));
        this.refreshKey = Keys.hmacShaKeyFor(Decoders.BASE64.decode(refreshSecretKey));
        this.redisService = redisService;
        accessTokenExpireTime = ONE_MINUTE * accessTokenExpiresTime;        // 30 min
        refreshTokenExpireTime = ONE_MINUTE * (accessTokenExpiresTime * 2); // 60 min
    }

    /**
     * Access + Refresh 토큰 생성 및 Redis에 저장
     * -> AuthService에서 토큰 생성 시 사용됨
     */
    public String createToken(JwtUserInfoDto user) {
        // JwtUserInfoDto에 담긴 userId를 기반으로 Access + Refresh 토큰 생성
        String accessToken = generateAccessToken(user);
        String refreshToken = generateRefreshToken(user);

        // Redis에 key=accessToken, value=refreshToken 형태로 저장
        saveToRedis(accessToken, refreshToken);

        // 프론트엔드에 보낼 accessToken 반환
        return accessToken;
    }

    /**
     * AccessToken 생성 - 기본 (RefreshToken 기반 재발급 시 사용됨)
     * 
     * Claim란? JWT 안에 들어 있는 정보 중 "페이로드"에 담긴 정보 (즉, 사용자 정보나 기타 데이터)
     */
    private String generateAccessToken(Claims claims) {
        ZonedDateTime now = ZonedDateTime.now();
        ZonedDateTime expires = now.plusSeconds(accessTokenExpireTime); // CurrentTime + ExpireTime

        return makeToken(key, claims, Date.from(now.toInstant()), Date.from(expires.toInstant()));
    }

    /**
     * AccessToken 생성 - 리프레시 토큰 기반
     */
    private String generateAccessToken(JwtUserInfoDto user) {
        Claims claims = Jwts.claims(); // JWT 토큰에 넣을 데이터 객체 생성
        claims.put(USERNAME_KEY, user.getId()); // user_id 키에 사용자 식별자 저장
        // claims.put(ROLE_KEY, "ROLE_USER"); // 현재는 권한 없으므로 주석 처리

        // 현재 시간 기준으로 accessToken 만료 시간 계산
        long now = (new Date()).getTime();
        Date expires = new Date(now + accessTokenExpireTime);

        // JWT 토큰 문자열 생성 후 반환
        return makeToken(key, claims, expires);
    }

    /**
     * RefreshToken 생성
     */
    private String generateRefreshToken(JwtUserInfoDto user) {
        Claims claims = Jwts.claims();
        claims.put(USERNAME_KEY, user.getId());
        claims.put(ROLE_KEY, "ROLE_USER");
        ZonedDateTime now = ZonedDateTime.now();
        ZonedDateTime expires = now.plusSeconds(refreshTokenExpireTime);
        return makeToken(refreshKey, claims, Date.from(now.toInstant()), Date.from(expires.toInstant()));
    }

    // 실제 JWT 문자열 생성 (만료 시간 설정)
    private String makeToken(Key secretKey, Claims claims, Date expires) {
        return Jwts.builder()
                .setClaims(claims) // 토큰에 넣을 데이터 객체 설정
                .setExpiration(expires) // 토큰 만료 시간 설정
                .signWith(secretKey, SignatureAlgorithm.HS256) // HS256 알고리즘 + 비밀키로 서명
                .compact(); // 최종적으로 토큰 문자열 생성
    }

    // 실제 JWT 문자열 생성 (시작 시간 + 만료 시간 설정)
    private String makeToken(Key secretKey, Claims claims, Date start, Date expires) {
        return Jwts.builder()
                .setClaims(claims)
                .setExpiration(expires)
                .setIssuedAt(start)
                .setExpiration(expires)
                .signWith(secretKey, SignatureAlgorithm.HS256)
                .compact();
    }

    // 해당 메서드는 아래 getLoginUserId 메서드로 대체됨
    // public String getUserId() {
    //     return getUserInfo(USERNAME_KEY);
    // }

    /**
     * 현재 로그인한 사용자의 userId (PK) 반환
     */
    public Long getUserId() {
        // 로그인한 사용자의 인증 정보 조회
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    
        if (auth != null && auth.getPrincipal() instanceof CustomUserDetails customUserDetails) {
            return customUserDetails.getUser().getId(); // userId 반환 (권한은 필요 없으므로 userId만 반환)
        }
    
        throw new UserNotFoundException();
    }

    /**
     * 토큰에서 userId 추출
     * -> JwtAuthFilter에서 사용자 식별자 추출 시 사용됨
     */
    public Long getUserId(String accessToken) {
        return parseClaims(accessToken)
                .get(USERNAME_KEY, Long.class);
    }

    // 해당 메서드 또한 getLoginUserId 메서드로 대체됨
    // private String getUserInfo(String needKey) {
    //     Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    //     if (authentication != null && authentication.getPrincipal() instanceof UserDetails userDetails) {
    //         userDetails = (UserDetails) authentication.getPrincipal();
    //         return switch (needKey) {
    //             case USERNAME_KEY -> userDetails.getUsername(); // 로그인 아이디(이메일)을 반환하는 메서드
    //             case ROLE_KEY -> userDetails.getAuthorities().toString();
    //             default -> throw new NotFoundUserException();
    //         };
    //     }
    //     return null;
    // }

    /**
     * 만료 시간 추출
     */
    public Date getExpiredTime(String token) {
        return parseClaims(token).getExpiration();
    }

    /**
     * JWT Claims 추출
     *
     * @return JWT Claims
     */
    private Claims parseClaims(String accessToken) {
        try {
            return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(accessToken).getBody();
        } catch (ExpiredJwtException e) {
            throw new ExpiredJwtException(null, e.getClaims(), "Expired JWT Token");
        }
    }

    private Claims parseClaimsForRefresh(String refreshToken) {
        try {
            return Jwts.parserBuilder().setSigningKey(refreshKey).build().parseClaimsJws(refreshToken).getBody();
        } catch (ExpiredJwtException e) {
            return e.getClaims();
        }
    }

    // Redis에 accessToken을 key로, refreshToken을 value로 저장
    private void saveToRedis(String accessToken, String refreshToken) {
        redisService.add(accessToken, refreshToken);
    }

    // Redis에서 refreshToken를 가져와 유효한지 검사 후 accessToken 갱신
    private String renewToken(String accessToken) {
        String refreshToken = redisService.getAndRemove(accessToken);
        boolean isValid = validateRefreshToken(refreshToken);
        if (isValid) return generateAccessToken(parseClaimsForRefresh(refreshToken));
        throw new ExpiredJwtException(null, null, null, null);
    }

    /**
     * 클라이언트가 보낸 Access Token의 유효성 검사
     * 
     * @param token 클라이언트가 보낸 Access Token
     * @param response Access Token이 만료된 경우 재발급한 토큰을 헤더에 실어서 보내기 위해 사용
     * @return 유효한 토큰인 경우 true, 유효하지 않은 경우 false
     */
    public boolean validateAccessToken(String token, HttpServletResponse response) {
        try {
            // token을 디코딩하면서, 서명이 맞는지(= 위조되지 않았는지) 검증
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);

            // 예외가 발생하지 않으면 유효한 토큰이므로 true 반환되어, 요청 처리가 진행됨
            return true;
        } catch (io.jsonwebtoken.security.SecurityException | MalformedJwtException e) { // 토큰 서명 오류 및 형식 오류 발생 시
            log.info(INVALID_TOKEN_MESSAGE, e);
            throw new MalformedJwtException(INVALID_TOKEN_MESSAGE);
        } catch (ExpiredJwtException e) { // 만료된 토큰인 경우
            log.info("Expired JWT Token", e);

            // 새 토큰 재발급 후 헤더에 담아 클라이언트에게 보내기
            response.addHeader("Authorization", "Bearer " + renewToken(token));

            // 만료된 토큰이어도 요청은 처리해 줌 (새 토큰을 제공했으니)
            return true;
        } catch (UnsupportedJwtException e) { // 기타 예외(지원하지 않는 토큰 형식)
            log.info("Unsupported JWT Token", e);
        } catch (IllegalArgumentException e) { // 기타 예외(내용이 비어있는 경우)
            log.info("JWT claims string is empty.", e);
        }
        return false;
    }

    /**
     * Refresh Token 검증 메서드
     * 
     * @param token 서버 내부에서 Redis에서 꺼낸 Refresh Token
     * @return 유효한 토큰인 경우 true, 유효하지 않은 경우 false
     */
    public boolean validateRefreshToken(String token) {
        try {
            // 서명을 검증(Refresh 토큰 전용 키로 검증)
            // 서명이 일치하지 않거나 토큰이 만료된 경우 예외 발생
            Jwts.parserBuilder().setSigningKey(refreshKey).build().parseClaimsJws(token);

            // 검증 성공시 true 반환 -> 새 Access 토큰 발급 가능
            return true;
        } catch (io.jsonwebtoken.security.SecurityException | MalformedJwtException e) { // 조되거나 훼손된 Refresh 토큰인 경우
            log.info(INVALID_TOKEN_MESSAGE + " ::: Refresh", e);
            // 예외를 던지고, 클라이언트는 재로그인 해야 함
            throw new MalformedJwtException(INVALID_TOKEN_MESSAGE + " ::: Refresh");
        } catch (ExpiredJwtException e) { // Refresh 토큰도 만료된 경우 -> 사용자는 반드시 재로그인 필요
            log.info("Expired JWT Token", e);
            throw new MalformedJwtException("Expired Refresh Token.\n Please login again.\n");
        } catch (UnsupportedJwtException e) { // 지원하지 않는 형식의 토큰인 경우
            log.info("Unsupported JWT Token", e);
        } catch (IllegalArgumentException e) { // 토큰 내용이 비어있는 경우
            log.info("JWT claims string is empty.", e);
        }
        // 검증 실패 -> 재로그인 필요
        return false;
    }

    /**
     * WebSocket에서 사용할 Access Token 유효성 검사 메서드
     * - HttpServletResponse 없이 단순 검증만 수행
     */
    public boolean validateAccessToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            log.warn("[JWT] WebSocket 인증 실패 - {}", e.getMessage());
            return false;
        }
    }

}
