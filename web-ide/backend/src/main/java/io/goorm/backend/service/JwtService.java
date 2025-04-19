package io.goorm.backend.service;

import io.goorm.backend.dto.auth.JwtUserInfoDto;
import io.goorm.backend.global.exception.NotFoundUserException;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.time.Instant;
import java.time.ZonedDateTime;
import java.util.Date;

/**
 * JWT 서비스
 *
 * JWT 토큰 생성, 검증, 갱신 등의 기능을 제공
 * Access/Refresh 토큰을 생성, 유효성 검증과 사용자 정보 추출, Redis에 Refresh 토큰 저장 및 재발급
 */
@Service
@Slf4j
public class JwtService {
    private final Key key; // Access Token 서명용 비밀 키
    private final Key refreshKey; // Refresh Token 서명용 비밀 키
    private final RedisService redisService; // Redis 서비스 (Redis에 refresh token 저장/조회하기 위한 의존성)
    private final long accessTokenExpireTime; // Access Token 유효 시간
    private final long refreshTokenExpireTime; // Refresh Token 유효 시간

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

    // 토큰 생성
    public String createToken(JwtUserInfoDto user) {
        String accessToken = generateAccessToken(user); // 액세스 토큰 생성
        String refreshToken = generateRefreshToken(user); // 리프레시 토큰 생성
        saveToRedis(accessToken, refreshToken); // 리프레시 토큰을 Redis에 저장
        return accessToken; // 액세스 토큰만 반환
    }

    // 토큰 생성 (만료 시간 지정)
    public String createToken(JwtUserInfoDto user, Instant expiredTime) {
        Claims claims = Jwts.claims();
        claims.put(USERNAME_KEY, user.getId()); // 사용자 식별자
        claims.put(ROLE_KEY, "ROLE_USER"); // 모든 사용자에게 기본 권한 부여
        Date expires = Date.from(expiredTime);

        return makeToken(key, claims, expires);
    }

    // Access Token 생성
    private String generateAccessToken(Claims claims) {
        ZonedDateTime now = ZonedDateTime.now();
        ZonedDateTime expires = now.plusSeconds(accessTokenExpireTime); // CurrentTime + ExpireTime

        return makeToken(key, claims, Date.from(now.toInstant()), Date.from(expires.toInstant()));
    }

    private String generateAccessToken(JwtUserInfoDto user) {
        Claims claims = Jwts.claims();
        claims.put(USERNAME_KEY, user.getId());
        claims.put(ROLE_KEY, "ROLE_USER");

        long now = (new Date()).getTime();
        Date expires = new Date(now + accessTokenExpireTime);

        return makeToken(key, claims, expires);
    }

    // Refresh Token 생성
    private String generateRefreshToken(JwtUserInfoDto user) {
        Claims claims = Jwts.claims();
        claims.put(USERNAME_KEY, user.getId());
        claims.put(ROLE_KEY, "ROLE_USER");
        ZonedDateTime now = ZonedDateTime.now();
        ZonedDateTime expires = now.plusSeconds(refreshTokenExpireTime);
        return makeToken(refreshKey, claims, Date.from(now.toInstant()), Date.from(expires.toInstant()));
    }

    // 실제 JWT 문자열 생성
    private String makeToken(Key secretKey, Claims claims, Date expires) {
        return Jwts.builder()
                .setClaims(claims)
                .setExpiration(expires)
                .signWith(secretKey, SignatureAlgorithm.HS256)
                .compact();
    }

    private String makeToken(Key secretKey, Claims claims, Date start, Date expires) {
        return Jwts.builder()
                .setClaims(claims)
                .setExpiration(expires)
                .setIssuedAt(start)
                .setExpiration(expires)
                .signWith(secretKey, SignatureAlgorithm.HS256)
                .compact();
    }

    public String getUserId() {
        return getUserInfo(USERNAME_KEY);
    }

    public String getUserId(String accessToken) {
        return parseClaims(accessToken)
                .get(USERNAME_KEY, String.class);
    }

    // 사용자 정보 추출
    private String getUserInfo(String needKey) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserDetails userDetails) {
            userDetails = (UserDetails) authentication.getPrincipal();
            return switch (needKey) {
                case USERNAME_KEY -> userDetails.getUsername();
                case ROLE_KEY -> userDetails.getAuthorities().toString();
                default -> throw new NotFoundUserException();
            };
        }
        return null;
    }

    public String getUserAuthority() {
        return getUserInfo(ROLE_KEY);
    }

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
        String refreshToken = redisService.getValue(accessToken);
        boolean isValid = validateRefreshToken(refreshToken);
        if (isValid) return generateAccessToken(parseClaimsForRefresh(refreshToken));
        throw new ExpiredJwtException(null, null, null, null);
    }

    // Access Token 유효성 검사
    public boolean validateAccessToken(String token, HttpServletResponse response) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return true;
        } catch (io.jsonwebtoken.security.SecurityException | MalformedJwtException e) {
            log.info(INVALID_TOKEN_MESSAGE, e);
            throw new MalformedJwtException(INVALID_TOKEN_MESSAGE);
        } catch (ExpiredJwtException e) {
            log.info("Expired JWT Token", e);
            response.addHeader("Authorization", "Bearer " + renewToken(token));
            return true;
        } catch (UnsupportedJwtException e) {
            log.info("Unsupported JWT Token", e);
        } catch (IllegalArgumentException e) {
            log.info("JWT claims string is empty.", e);
        }
        return false;
    }

    // Refresh Token 유효성 검사
    public boolean validateRefreshToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(refreshKey).build().parseClaimsJws(token);
            return true;
        } catch (io.jsonwebtoken.security.SecurityException | MalformedJwtException e) {
            log.info(INVALID_TOKEN_MESSAGE + " ::: Refresh", e);
            throw new MalformedJwtException(INVALID_TOKEN_MESSAGE + " ::: Refresh");
        } catch (ExpiredJwtException e) {
            log.info("Expired JWT Token", e);
            throw new MalformedJwtException("Expired Refresh Token.\n Please login again.\n");
        } catch (UnsupportedJwtException e) {
            log.info("Unsupported JWT Token", e);
        } catch (IllegalArgumentException e) {
            log.info("JWT claims string is empty.", e);
        }
        return false;
    }
}
