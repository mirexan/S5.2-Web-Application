package com.boticarium.backend.infrastructure.inbound.controller;

import com.boticarium.backend.application.dto.auth.AuthResponse;
import com.boticarium.backend.application.dto.user.RegisterRequest;
import com.boticarium.backend.application.service.AuthenticationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {
	private final AuthenticationService authService;

	@PostMapping("/create-admin")
	public ResponseEntity<AuthResponse> createAdmin(@Valid @RequestBody RegisterRequest request) {
		return ResponseEntity.ok(authService.adminRegister(request));
	}
}
