package com.boticarium.backend.application.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para recibir el token de Google desde el frontend
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GoogleLoginRequest {
	private String token;  // Token JWT de Google
}
