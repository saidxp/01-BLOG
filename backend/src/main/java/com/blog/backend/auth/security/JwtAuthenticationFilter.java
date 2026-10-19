package com.blog.backend.auth.security;

import java.io.IOException;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsServiceImpl userDetailsService;
    private final JwtAuthenticationEntryPoint authenticationEntryPoint;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        String token = jwtService.extractTokenFromCookie(request);
        if (token == null) {
            filterChain.doFilter(request, response);
            return;
        }

        String username;

        try {
            username = jwtService.extractUsername(token);

        } catch (JwtException e) {

            authenticationEntryPoint.commence(
                    request,
                    response,
                    new AuthenticationException("Invalid authentication token") {
                    });
            return;
        }

        // User is not authenticated yet !! Her I Will Put The User In The Security
        // Context (!!)
        if (username != null
                && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                // <<===>> \\ <<==>> \\ (!<->!)....

                if (!userDetails.isAccountNonLocked()) {
                    SecurityContextHolder.clearContext();

                    ResponseCookie cookie = ResponseCookie.from("jwt", "")
                            .httpOnly(true)
                            .secure(false)
                            .sameSite("Lax")
                            .path("/")
                            .maxAge(0)
                            .build();

                    response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

                    filterChain.doFilter(request, response);
                    return; 
                    
                }
                if (jwtService.validateToken(token, userDetails)) {
                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities());
                    SecurityContextHolder
                            .getContext()
                            .setAuthentication(authentication);
                }

            } catch (UsernameNotFoundException ex) {

                SecurityContextHolder.clearContext();

                ResponseCookie cookie = ResponseCookie.from("jwt", "")
                        .httpOnly(true)
                        .secure(false)
                        .sameSite("Lax")
                        .path("/")
                        .maxAge(0)
                        .build();

                response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

                filterChain.doFilter(request, response);
                return;
            }
            // {} <-> {}
        }
        filterChain.doFilter(request, response);
    }

}
