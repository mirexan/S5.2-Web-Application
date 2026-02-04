package com.boticarium.backend.application.dto.user;

import com.boticarium.backend.domain.model.Role;

import java.time.LocalDateTime;

public record UserResponse(
		Long id,
		String username,
		String email,
		String phone,
		Role role,
		Integer points,
		LocalDateTime createdAt,
		Integer level
) {
}
