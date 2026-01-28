package com.boticarium.backend.infrastructure.security;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@Slf4j
public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {

	@Override
	public void commence(HttpServletRequest request, HttpServletResponse response,
						 AuthenticationException authException) throws IOException {

		log.error("🚨 UNAUTHORIZED ACCES (401) to: {} | Error: {}",
				request.getRequestURI(),
				authException.getMessage());
		response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Login to access this resource");
	}
}
