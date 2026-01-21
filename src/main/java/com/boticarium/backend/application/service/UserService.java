package com.boticarium.backend.application.service;

import com.boticarium.backend.application.dto.user.UserResponse;
import com.boticarium.backend.domain.model.Role;
import com.boticarium.backend.domain.model.User;
import com.boticarium.backend.infrastructure.outbound.persistance.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {
	private final UserRepository userRepository;

	public List<UserResponse> getAllUsers() {
		return userRepository.findAll()
				.stream()
				.map(user -> new UserResponse(
						user.getId(),
						user.getUsername(),
						user.getEmail(),
						user.getRole(),
						user.getPoints()
				))
				.collect(Collectors.toList());
	}
	public void deleteUser(Long userId, User actualUser) {
		User targetUser = userRepository.findById(userId)
				.orElseThrow(()-> new EntityNotFoundException("User not found"));
		if (actualUser.getRole() == Role.USER
				&& !actualUser.getId().equals(targetUser.getId())) {
			throw new AccessDeniedException("You are not allowed to delete another user");
		}
		if (targetUser.getRole() == Role.ADMIN) {
			long totalAdmins = userRepository.countByRole(Role.ADMIN);
			if (totalAdmins <= 1) {
				throw new IllegalStateException("Operation denied: There is only one admin in database");
			}
		}
		if (actualUser.getRole() == Role.ADMIN && targetUser.getRole() == Role.ADMIN
				&& !actualUser.getId().equals(targetUser.getId())) {
			throw new AccessDeniedException("You are not allowed to delete another Admin");
		}
		userRepository.delete(targetUser);
	}
}
