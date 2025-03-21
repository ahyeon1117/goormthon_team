package io.goorm.backend.global.filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.goorm.backend.dto.res.ApiResponse;
import io.goorm.backend.dto.res.ErrorResponse;
import io.goorm.backend.dto.security.AuthenticationToken;
import io.goorm.backend.dto.security.JwtUserInfoDto;
import io.goorm.backend.dto.security.SignInDto;
import io.goorm.backend.entity.Authority;
import io.goorm.backend.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

public class JwtAuthenticationFilter
  extends UsernamePasswordAuthenticationFilter {

  private final JwtService jwtService;
  private final boolean postOnly = true;

  public JwtAuthenticationFilter(JwtService jwtService) {
    this.jwtService = jwtService;
    setFilterProcessesUrl("/api/v1/auth/login");
  }

  @Override
  public Authentication attemptAuthentication(
    HttpServletRequest request,
    HttpServletResponse response
  ) throws AuthenticationException {
    if (postOnly && !request.getMethod().equals("POST")) {
      throw new AuthenticationServiceException(
        "Authentication method not supported: " + request.getMethod()
      );
    } else {
      try {
        SignInDto requestDto = new ObjectMapper()
          .readValue(request.getInputStream(), SignInDto.class);
        String userId = requestDto.getUserId();
        String password = requestDto.getPassword();
        return getAuthenticationManager()
          .authenticate(
            new UsernamePasswordAuthenticationToken(userId, password)
          );
      } catch (IOException e) {
        throw new RuntimeException(e);
      }
    }
  }

  // 로그인 성공 시
  @Override
  protected void successfulAuthentication(
    HttpServletRequest request,
    HttpServletResponse response,
    FilterChain chain,
    Authentication authResult
  ) throws IOException, ServletException {
    String username =
      ((AuthenticationToken) authResult.getPrincipal()).getUsername();
    String role =
      ((AuthenticationToken) authResult.getPrincipal()).getAuthorities()
        .stream()
        .findFirst()
        .orElseThrow()
        .getAuthority();
    String token = jwtService.createToken(
      new JwtUserInfoDto(username, Authority.valueOf(role))
    );
    ApiResponse<String> responseMessage = ApiResponse.success(token);
    String responseJSON = new ObjectMapper()
      .writeValueAsString(responseMessage);
    response.setContentType("application/json; charset=UTF-8"); // JSON 타입 + UTF-8 설정
    response.setCharacterEncoding("UTF-8"); // 한글 인코딩 설정 추가
    response.getWriter().write(responseJSON);
  }

  // 로그인 실패 시
  @Override
  protected void unsuccessfulAuthentication(
    HttpServletRequest request,
    HttpServletResponse response,
    AuthenticationException failed
  ) throws IOException {
    ErrorResponse errorResponse = ErrorResponse.of(
      HttpStatus.UNAUTHORIZED.value(),
      failed.getMessage(),
      "/login",
      "id and password invalid"
    );
    String responseJSON = new ObjectMapper().writeValueAsString(errorResponse);
    response.setContentType("application/json; charset=UTF-8"); // JSON 타입 + UTF-8 설정
    response.setCharacterEncoding("UTF-8"); // 한글 인코딩 설정 추가
    response.getWriter().write(responseJSON);
  }
}
