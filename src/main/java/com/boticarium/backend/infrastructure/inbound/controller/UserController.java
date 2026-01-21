package com.boticarium.backend.infrastructure.inbound.controller;

import com.boticarium.backend.application.dto.user.UserResponse;
import com.boticarium.backend.application.service.UserService;
import com.boticarium.backend.domain.model.Role;
import com.boticarium.backend.domain.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
		if (actualUser == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
		if (actualUser.getRole() == Role.ADMIN) {
			return ResponseEntity.ok(userService.getAllUsers());
		}
		return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
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
