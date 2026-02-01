package com.boticarium.backend.infrastructure.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.AuthorizeHttpRequestsConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.boticarium.backend.infrastructure.security.CustomAccessDeniedHandler;
import com.boticarium.backend.infrastructure.security.CustomAuthenticationEntryPoint;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

	private final JwtAuthenticationFilter jwtAuthenticationFilter;
	private final AuthenticationProvider authenticationProvider;
	private final CustomAccessDeniedHandler accessDeniedHandler;
	private final CustomAuthenticationEntryPoint authenticationEntryPoint;

	public SecurityConfig(
			JwtAuthenticationFilter jwtAuthenticationFilter,
			AuthenticationProvider authenticationProvider,
			CustomAccessDeniedHandler accessDeniedHandler,
			CustomAuthenticationEntryPoint authenticationEntryPoint) {
		this.jwtAuthenticationFilter = jwtAuthenticationFilter;
		this.authenticationProvider = authenticationProvider;
		this.accessDeniedHandler = accessDeniedHandler;
		this.authenticationEntryPoint = authenticationEntryPoint;
	}

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http
				.csrf(AbstractHttpConfigurer::disable)
				.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				.authenticationProvider(authenticationProvider)
				.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
				.authorizeHttpRequests(this::configureRoutes)
				.exceptionHandling(exception -> exception
						.accessDeniedHandler(accessDeniedHandler)
						.authenticationEntryPoint(authenticationEntryPoint)
				);
		return http.build();
	}

	private void configureRoutes(AuthorizeHttpRequestsConfigurer<HttpSecurity>.AuthorizationManagerRequestMatcherRegistry auth) {
		auth
				.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
				.requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html", "/auth/**").permitAll()
				.requestMatchers("/error").permitAll()
				.requestMatchers(HttpMethod.POST, "/uploads/**").permitAll()
				.requestMatchers("/uploads/**").permitAll()

				.requestMatchers("/products/management/**").hasAuthority("ROLE_ADMIN")
				.requestMatchers(HttpMethod.POST, "/products/**").hasAuthority("ROLE_ADMIN")
				.requestMatchers(HttpMethod.PUT, "/products/**").hasAuthority("ROLE_ADMIN")
				.requestMatchers(HttpMethod.DELETE, "/products/**").hasAuthority("ROLE_ADMIN")
				.requestMatchers("/orders/management/**").hasAuthority("ROLE_ADMIN")
				.requestMatchers("/admin/**").hasAuthority("ROLE_ADMIN")

				.requestMatchers(HttpMethod.GET, "/products/**").permitAll()

				.requestMatchers("/orders/**").authenticated()
				.requestMatchers("/users/**").authenticated()

				.anyRequest().authenticated();
	}
}
