package com.boticarium.backend.application.service;

import com.boticarium.backend.application.dto.user.UserResponse;
import com.boticarium.backend.application.dto.user.UpdateProfileRequest;
import com.boticarium.backend.domain.model.Role;
import com.boticarium.backend.domain.model.User;
import com.boticarium.backend.infrastructure.outbound.persistence.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {
	private final UserRepository userRepository;

	public List<UserResponse> getAllUsers() {
		return userRepository.findAll()
				.stream()
				.map(this::mapToUserResponse)
				.toList();
	}

	public UserResponse getUserById(Long id) {
		User user = findUserOrThrow(id);
		return mapToUserResponse(user);
	}

	@Transactional
	public void deleteUser(Long userId, User actualUser) {
		User targetUser = findUserOrThrow(userId);
		validateDeletionPermission(actualUser, targetUser);
		if (targetUser.getRole() == Role.ADMIN) {
			ensureNotLastAdmin();
		}
		log.warn("User {} ({}) eliminated user {} ({})",
				actualUser.getUsername(), actualUser.getRole(),
				userId, targetUser.getRole());
		userRepository.delete(targetUser);
	}

	public UserResponse getUserProfile(User user) {
		return mapToUserResponse(user);
	}

	@Transactional
	public UserResponse updateProfile(User user, UpdateProfileRequest request) {
		user.setEmail(request.email());
		user.setPhone(request.phone());
		userRepository.save(user);
		return mapToUserResponse(user);
	}

	@Transactional
	public void deleteProfile(User user) {
		if (user.getRole() == Role.ADMIN) {
			ensureNotLastAdmin();
		}
		log.warn("User {} ({}) deleted their own account", user.getUsername(), user.getRole());
		userRepository.delete(user);
	}

	private void validateDeletionPermission(User requester, User target){
		if (requester.getRole() == Role.USER && !requester.getId().equals(target.getId())) {
			throw new AccessDeniedException("You are not allowed to delete another user");
		}
		if (requester.getRole() == Role.ADMIN && target.getRole() == Role.ADMIN
				&& !requester.getId().equals(target.getId())) {
			throw new AccessDeniedException("You are not allowed to delete another Admin");
		}
	}

	private void ensureNotLastAdmin(){
		long totalAdmins = userRepository.countByRole(Role.ADMIN);
		if (totalAdmins <= 1) {
			throw new IllegalStateException("Operation denied: There is only one admin in database");
		}
	}

	private User findUserOrThrow(Long id) {
		return userRepository.findById(id)
				.orElseThrow(() -> new EntityNotFoundException("User not found with id: " + id));
	}
	private UserResponse mapToUserResponse(User user) {
		return new UserResponse(
				user.getId(),
				user.getUsername(),
				user.getEmail(),
				user.getPhone(),
				user.getRole(),
				user.getPoints(),
				user.getCreatedAt(),
				user.getLevel()
		);
	}
}
