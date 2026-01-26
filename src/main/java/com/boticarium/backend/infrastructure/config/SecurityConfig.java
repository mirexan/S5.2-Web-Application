package com.boticarium.backend.infrastructure.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {
	private final JwtAuthenticationFilter jwtAuthenticationFilter;
	private final AuthenticationProvider authenticationProvider;

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
	http.csrf(AbstractHttpConfigurer::disable)
			.authorizeHttpRequests(auth -> auth
					.requestMatchers(
							"/v3/api-docs/**",
							"/swagger-ui/**",
							"/swagger-ui.html"
					).permitAll()
					.requestMatchers("/auth/**").permitAll()
					.requestMatchers("/orders/management/**").hasAuthority("ROLE_ADMIN")
					.requestMatchers("/orders/**").authenticated()
					.requestMatchers("/products/management/**").hasAuthority("ROLE_ADMIN")
					.requestMatchers(HttpMethod.POST,"/products/**").hasAuthority("ROLE_ADMIN")
					.requestMatchers(HttpMethod.PUT,"/products/**").hasAuthority("ROLE_ADMIN")
					.requestMatchers(HttpMethod.DELETE,"/products/**").hasAuthority("ROLE_ADMIN")
					.requestMatchers(HttpMethod.GET,"/products/**").permitAll()
					.requestMatchers("/admin/**").hasAuthority("ROLE_ADMIN")
					.requestMatchers("/users/**").authenticated()
					.anyRequest().authenticated()
			)
			.sessionManagement(session -> session
					.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
			)
			.authenticationProvider(authenticationProvider)
			.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
	return http.build();
	}
}
