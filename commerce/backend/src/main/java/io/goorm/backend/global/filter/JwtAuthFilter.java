package io.goorm.backend.global.filter;

import io.goorm.backend.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.filter.OncePerRequestFilter;

@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

  private final UserDetailsService userDetailsService;
  private final JwtService jwtService;

  @Override
  protected void doFilterInternal(
    HttpServletRequest request,
    HttpServletResponse response,
    FilterChain filterChain
  ) throws ServletException, IOException {
    try {
      String authorizationHeader = request.getHeader("Authorization");

      if (
        authorizationHeader != null && authorizationHeader.startsWith("Bearer ")
      ) {
        String token = authorizationHeader.substring(7);
        if (jwtService.validateAccessToken(token, response)) {
          String userId = jwtService.getUserId(token);
          UserDetails userDetails = userDetailsService.loadUserByUsername(
            userId
          );

          if (userDetails != null) {
            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
              userDetails,
              null,
              userDetails.getAuthorities()
            );
            SecurityContextHolder
              .getContext()
              .setAuthentication(authentication);
          }
        }
      } else {
        throw new BadCredentialsException("It is Not Token in Header");
      }
    } catch (BadCredentialsException | UsernameNotFoundException e) {
      response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
      response.setContentType("application/json");
      response.getWriter().write(e.getMessage());
      return;
    }

    filterChain.doFilter(request, response);
  }
}
