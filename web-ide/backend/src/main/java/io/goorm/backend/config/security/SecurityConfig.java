package io.goorm.backend.config.security;

import io.goorm.backend.global.filter.JwtAuthFilter;
import io.goorm.backend.service.JwtService;
import io.goorm.backend.service.auth.CustomUserDetailsService;
import io.goorm.backend.service.auth.RedisService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.security.web.util.matcher.OrRequestMatcher;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

  private final JwtService jwtService; // 토큰 생성 및 검증 서비스
  private final CustomUserDetailsService customUserDetailsService; // 사용자 정보를 DB에서 조회하는 서비스
  private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint; // 인증 예외 처리
  private final RedisService redisService; // Redis 서비스

  //  private final AuthenticationConfiguration authenticationConfiguration; // 인증 관리자 설정

  // 인증 관리자 빈 등록
  @Bean
  public AuthenticationManager authenticationManager(
    AuthenticationConfiguration config
  ) throws Exception {
    return config.getAuthenticationManager();
  }

  /*
    // 커스텀 로그인 필터 (로그인 요청을 가로채 AuthenticationManager에게 인증 처리를 위임)
    // ! 현재 프로젝트에서는 로인 필터가 아닌 컨트롤러에서 로그인 처리를 하고 있어 사용하지 않음
    // @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() throws Exception {
        JwtAuthenticationFilter filter = new JwtAuthenticationFilter(jwtService);
        filter.setAuthenticationManager(authenticationManager(authenticationConfiguration));
        return filter;
    }
    */

  // 기본 SecurityFilterChain 설정
  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    // 인증이 필요 없는 URL 패턴
    // ignoring()을 사용하면 필터 자체를 무시하기 때문에, permitAll()로 설정해야 보안 필터는 통과하면서 인증만 우회함
    OrRequestMatcher publicUrlMatcher = new OrRequestMatcher(
      new AntPathRequestMatcher("/api/v1/auth/signup"),
      new AntPathRequestMatcher("/api/v1/auth/login"),
      new AntPathRequestMatcher("/v3/api-docs/**"),
      new AntPathRequestMatcher("/swagger-ui/**"),
      // swagger-ui/** 만으로는 아래 경로들은 필터 매칭 안되므로 명시 필요
      new AntPathRequestMatcher("/swagger-ui.html"),
      new AntPathRequestMatcher("/swagger-resources/**"),
      new AntPathRequestMatcher("/webjars/**"),
      new AntPathRequestMatcher("/api/v1/kernels/**"),
      new AntPathRequestMatcher("/ws-chat/**")
    );

    http
      .cors(Customizer.withDefaults())
      .csrf(AbstractHttpConfigurer::disable)
      .headers(AbstractHttpConfigurer::disable)
      .authorizeHttpRequests(request ->
        request
          .requestMatchers("/api/v1/auth/signup", "/api/v1/auth/login", "/api/v1/kernels/**", "/ws-chat/**")
          .permitAll()
          .requestMatchers(
            "/v3/api-docs/**",
            "/swagger-ui/**",
            "/swagger-ui.html",
            "/swagger-resources/**",
            "/webjars/**"
          )
          .permitAll() // Swagger UI 접근 허용
          .anyRequest()
          .authenticated() // 그 외 모든 요청 인증 처리
      )
      // .addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class)
      .addFilterAfter(
        new JwtAuthFilter(
          customUserDetailsService,
          jwtService,
          publicUrlMatcher,
          redisService
        ),
        UsernamePasswordAuthenticationFilter.class
      )
      .exceptionHandling(exception ->
        exception.authenticationEntryPoint(jwtAuthenticationEntryPoint)
      );
    return http.build();
  }

  // 비밀번호 암호화 빈 등록
  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

  @Bean
  public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration config = new CorsConfiguration();
    config.setAllowedOrigins(List.of("*")); // 모든 요청 허용
    config.setAllowedMethods(
      List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
    );
    config.setAllowedHeaders(List.of("*"));
    config.setAllowCredentials(false);

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", config);
    return source;
  }

}