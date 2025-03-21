package io.goorm.backend.config;

import io.goorm.backend.global.filter.JwtAuthFilter;
import io.goorm.backend.global.filter.JwtAuthenticationFilter;
import io.goorm.backend.service.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

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
  public WebSecurityCustomizer webSecurityCustomizer() {
    return webSecurity ->
      webSecurity.ignoring().requestMatchers("/waiting", "/api/v1/auth/**");
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
    http
      .csrf(AbstractHttpConfigurer::disable)
      .headers(AbstractHttpConfigurer::disable)
      .authorizeHttpRequests(request ->
        request
          .requestMatchers("/api/v1/auth/**")
          .permitAll() // 해당 경로로 시작하는 요청 모두 접근 허가
          .anyRequest()
          .authenticated() // 그 외 모든 요청 인증 처리
      )
      .addFilterBefore(
        new JwtAuthenticationFilter(jwtService),
        UsernamePasswordAuthenticationFilter.class
      )
      .addFilterAfter(
        new JwtAuthFilter(customUserDetailsService, jwtService),
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
