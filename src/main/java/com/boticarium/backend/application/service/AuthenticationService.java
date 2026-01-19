package com.boticarium.backend.application.service;

import com.boticarium.backend.application.dto.auth.AuthResponse;
import com.boticarium.backend.application.dto.auth.RegisterRequest;
import com.boticarium.backend.domain.model.Role;
import com.boticarium.backend.domain.model.User;
import com.boticarium.backend.infrastructure.config.JwtService;
import com.boticarium.backend.infrastructure.outbound.persistance.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	private final JwtService jwtService;
	private final AuthenticationManager authenticationManager;

	public AuthResponse register(RegisterRequest request){
		User user = User.builder()
				.userName(request.username())
				.password(passwordEncoder.encode(request.password()))
				.email(request.email())
				.role(Role.USER)
				.points(0)
				.build();
		userRepository.save(user);
		 String jwtToken = jwtService.generateToken((UserDetails) user);
		 return new AuthResponse(jwtToken);
	}
}
