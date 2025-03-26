package io.goorm.backend.global.filter;

import io.goorm.backend.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.util.matcher.RequestMatcher;
import org.springframework.web.filter.OncePerRequestFilter;

public class JwtAuthFilter extends OncePerRequestFilter {

    private final UserDetailsService userDetailsService;
    private final JwtService jwtService;
    private final RequestMatcher skipRequestMatcher;

    public JwtAuthFilter(
        UserDetailsService userDetailsService,
        JwtService jwtService
    ) {
        this.userDetailsService = userDetailsService;
        this.jwtService = jwtService;
        this.skipRequestMatcher = null;
    }

    public JwtAuthFilter(
        UserDetailsService userDetailsService,
        JwtService jwtService,
        RequestMatcher skipRequestMatcher
    ) {
        this.userDetailsService = userDetailsService;
        this.jwtService = jwtService;
        this.skipRequestMatcher = skipRequestMatcher;
    }

    @Override
    protected void doFilterInternal(
        @NonNull HttpServletRequest request,
        @NonNull HttpServletResponse response,
        @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        // 인증을 건너뛸 경로인 경우 필터를 통과시킴
        if (skipRequestMatcher != null && skipRequestMatcher.matches(request)) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            String authorizationHeader = request.getHeader("Authorization");

            if (
                authorizationHeader != null &&
                authorizationHeader.startsWith("Bearer ")
            ) {
                String token = authorizationHeader.substring(7);
                if (jwtService.validateAccessToken(token, response)) {
                    String userId = jwtService.getUserId(token);
                    UserDetails userDetails =
                        userDetailsService.loadUserByUsername(userId);

                    if (userDetails != null) {
                        UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities()
                            );
                        SecurityContextHolder.getContext()
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
