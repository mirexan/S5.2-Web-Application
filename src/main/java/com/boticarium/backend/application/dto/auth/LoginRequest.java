package com.boticarium.backend.application.dto.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

public record LoginRequest(
		@NotBlank(message = "User name is mandatory")
		String username,
		@NotBlank(message = "Password is mandatory")
		String password
) {
}
