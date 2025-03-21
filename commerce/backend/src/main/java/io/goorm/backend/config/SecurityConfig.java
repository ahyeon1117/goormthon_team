package io.goorm.backend.config;

import io.goorm.backend.global.filter.JwtAuthFilter;
import io.goorm.backend.global.filter.JwtAuthenticationFilter;
import io.goorm.backend.service.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.security.web.util.matcher.OrRequestMatcher;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

  private final JwtService jwtService;
  private final UserDetailsService customUserDetailsService;
  private final AuthenticationConfiguration authenticationConfiguration;
  private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

  @Bean
  public AuthenticationManager authenticationManager(
    AuthenticationConfiguration config
  ) throws Exception {
    return config.getAuthenticationManager();
  }

  // 3.
  @Bean
  public JwtAuthenticationFilter jwtAuthenticationFilter() throws Exception {
    JwtAuthenticationFilter filter = new JwtAuthenticationFilter(jwtService);
    filter.setAuthenticationManager(
      authenticationManager(authenticationConfiguration)
    );
    return filter;
  }

  @Bean
  public SecurityFilterChain adminSecurityFilterChain(HttpSecurity http)
    throws Exception {
    return http
      .securityMatcher("/admin/**")
      .authorizeHttpRequests(auth -> auth.anyRequest().hasRole("ADMIN"))
      .build();
  }

  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    // 인증이 필요 없는 URL 패턴 정의
    OrRequestMatcher publicUrlMatcher = new OrRequestMatcher(
      new AntPathRequestMatcher("/waiting/**"),
      new AntPathRequestMatcher("/api/v1/auth/**"),
      new AntPathRequestMatcher("/api/v1/products/**", "GET") // GET 메서드만 허용
    );

    http
      .csrf(AbstractHttpConfigurer::disable)
      .headers(AbstractHttpConfigurer::disable)
      .authorizeHttpRequests(request ->
        request
          .requestMatchers("/waiting/**").permitAll()
          .requestMatchers("/api/v1/auth/**").permitAll()
          .requestMatchers(HttpMethod.GET, "/api/v1/products/**").permitAll() // GET 메서드만 허용
          .anyRequest()
          .authenticated() // 그 외 모든 요청 인증 처리
      )
      .addFilterBefore(
        jwtAuthenticationFilter(), // 빈으로 정의된 필터 사용
        UsernamePasswordAuthenticationFilter.class
      )
      .addFilterAfter(
        new JwtAuthFilter(customUserDetailsService, jwtService, publicUrlMatcher),
        UsernamePasswordAuthenticationFilter.class
      )
      .exceptionHandling(exception ->
        exception.authenticationEntryPoint(jwtAuthenticationEntryPoint)
      );
    return http.build();
  }

  @Bean
  public BCryptPasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }
}
