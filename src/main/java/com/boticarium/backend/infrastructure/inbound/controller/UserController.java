package com.boticarium.backend.infrastructure.inbound.controller;

import com.boticarium.backend.application.dto.user.UserResponse;
import com.boticarium.backend.application.dto.user.UpdateProfileRequest;
import com.boticarium.backend.application.service.UserService;
import com.boticarium.backend.domain.model.Role;
import com.boticarium.backend.domain.model.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {
	private final UserService userService;

	@GetMapping
	public ResponseEntity<List<UserResponse>> getAllUsers(@AuthenticationPrincipal User actualUser) {
		if (actualUser.getRole() == Role.ADMIN) {
			return ResponseEntity.ok(userService.getAllUsers());
		}
		throw new AccessDeniedException("Access denied : you dont have permission " +
				"to access this resource");
	}

	@GetMapping("/{id}")
	public ResponseEntity<UserResponse> getUserById(
			@PathVariable Long id, @AuthenticationPrincipal User currentUser
	) {
		if (currentUser.getRole() != Role.ADMIN && !currentUser.getId().equals(id)) {
			throw new AccessDeniedException("Access denied : you dont have permission " +
					"to access another user resource");
		}
		return ResponseEntity.ok(userService.getUserById(id));
	}

	@GetMapping("/profile")
	public ResponseEntity<UserResponse> getProfile(@AuthenticationPrincipal User currentUser) {
		return ResponseEntity.ok(userService.getUserProfile(currentUser));
	}

	@PutMapping("/profile")
	public ResponseEntity<UserResponse> updateProfile(
			@AuthenticationPrincipal User currentUser,
			@Valid @RequestBody UpdateProfileRequest request) {
		return ResponseEntity.ok(userService.updateProfile(currentUser, request));
	}

	@DeleteMapping("/profile")
	public ResponseEntity<Void> deleteProfile(@AuthenticationPrincipal User currentUser) {
		userService.deleteProfile(currentUser);
		return ResponseEntity.noContent().build();
	}

	@DeleteMapping("/me")
	public ResponseEntity<Void> deleteMe(@AuthenticationPrincipal User actualUser) {
		userService.deleteUser(actualUser.getId(), actualUser);
		return ResponseEntity.noContent().build();
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteUser(
			@PathVariable Long id,
			@AuthenticationPrincipal User actualUser) {
		userService.deleteUser(id, actualUser);
		return ResponseEntity.noContent().build();
	}
}
