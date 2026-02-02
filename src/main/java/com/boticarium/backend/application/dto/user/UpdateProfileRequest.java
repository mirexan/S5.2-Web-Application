package com.boticarium.backend.application.dto.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record UpdateProfileRequest(
		@NotBlank(message = "Email is mandatory")
		@Email(message = "Non valid email format")
		String email,
		@NotBlank(message = "Phone is mandatory")
		String phone
) {
}
