package com.boticarium.backend.application.dto.user;

import jakarta.validation.constraints.*;

public record RegisterRequest(
		@NotBlank(message = "User name is mandatory")
		String username,
		@NotBlank(message = "Email is mandatory")
		@Email(message = "Non valid email format")
		String email,
		@NotBlank(message = "password is mandatory")
		@Size(min = 6, message = "It must contain at least 6 characters")
		String password,
		String phone // Opcional - puede ser null
) {
}
