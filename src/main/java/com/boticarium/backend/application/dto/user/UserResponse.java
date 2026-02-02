package com.boticarium.backend.application.dto.user;

import com.boticarium.backend.domain.model.Role;

public record UserResponse(
		Long id,
		String username,
		String email,
		String phone,
		Role role,
		Integer points
) {
}
