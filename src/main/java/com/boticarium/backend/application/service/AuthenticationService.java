package com.boticarium.backend.application.service;

import com.boticarium.backend.application.dto.auth.AuthResponse;
import com.boticarium.backend.application.dto.auth.LoginRequest;
import com.boticarium.backend.application.dto.user.RegisterRequest;
import com.boticarium.backend.domain.model.Role;
import com.boticarium.backend.domain.model.User;
import com.boticarium.backend.infrastructure.config.JwtService;
import com.boticarium.backend.infrastructure.outbound.persistence.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
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
				.username(request.username())
				.password(passwordEncoder.encode(request.password()))
				.email(request.email())
				.role(Role.USER)
				.points(0)
				.build();
		userRepository.save(user);
		 String jwtToken = jwtService.generateToken((UserDetails) user);
		 return new AuthResponse(jwtToken);
	}

	public AuthResponse adminRegister(RegisterRequest request){
		User user = User.builder()
				.username(request.username())
				.password(passwordEncoder.encode(request.password()))
				.email(request.email())
				.role(Role.ADMIN)
				.points(1000)
				.build();
		userRepository.save(user);
		String jwtToken = jwtService.generateToken((UserDetails) user);
		return new AuthResponse(jwtToken);
	}

	public AuthResponse login(LoginRequest request){
		authenticationManager.authenticate(
				new UsernamePasswordAuthenticationToken(
						request.username(),
						request.password()
				)
		);
		User user = userRepository.findByUsername(request.username())
				.orElseThrow();
		String jwtToken = jwtService.generateToken((UserDetails) user);
		return new AuthResponse(jwtToken);
	}
}
