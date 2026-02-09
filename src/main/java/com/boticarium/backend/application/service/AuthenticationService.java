package com.boticarium.backend.application.service;

import com.boticarium.backend.application.dto.auth.AuthResponse;
import com.boticarium.backend.application.dto.auth.GoogleLoginRequest;
import com.boticarium.backend.application.dto.auth.LoginRequest;
import com.boticarium.backend.application.dto.user.RegisterRequest;
import com.boticarium.backend.domain.model.Role;
import com.boticarium.backend.domain.model.User;
import com.boticarium.backend.infrastructure.security.GoogleOAuthService;
import com.boticarium.backend.infrastructure.security.JwtService;
import com.boticarium.backend.infrastructure.outbound.persistence.UserRepository;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthenticationService {
	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	private final JwtService jwtService;
	private final AuthenticationManager authenticationManager;
	private final GoogleOAuthService googleOAuthService;

	public AuthResponse register(RegisterRequest request){
		User user = User.builder()
				.username(request.username())
				.password(passwordEncoder.encode(request.password()))
				.email(request.email())
				.phone(request.phone())
				.role(Role.USER)
				.points(0)
				.build();
		userRepository.save(user);
		 String jwtToken = jwtService.generateToken(user);
		 return new AuthResponse(jwtToken);
	}

	public AuthResponse adminRegister(RegisterRequest request){
		User user = User.builder()
				.username(request.username())
				.password(passwordEncoder.encode(request.password()))
				.email(request.email())
				.phone(request.phone())
				.role(Role.ADMIN)
				.points(1000)
				.build();
		userRepository.save(user);
		String jwtToken = jwtService.generateToken(user);
		return new AuthResponse(jwtToken);
	}

	public AuthResponse login(LoginRequest request){
		try {
			authenticationManager.authenticate(
					new UsernamePasswordAuthenticationToken(
							request.username(),
							request.password()
					)
			);
			User user = userRepository.findByUsername(request.username())
					.orElseThrow();
			String jwtToken = jwtService.generateToken(user);
			return new AuthResponse(jwtToken);
		} catch (Exception ex) {
			log.warn("Login fallido para username={}", request.username());
			throw ex;
		}
	}


	public AuthResponse loginWithGoogle(GoogleLoginRequest request) throws Exception {
		
		GoogleIdToken.Payload payload = googleOAuthService.verifyGoogleToken(request.getToken());
		
		String email = payload.getEmail();
		String username = (String) payload.get("name");
		
		if (userRepository.findByEmail(email).isEmpty()) {
			log.info("Creating new user from google: {}", email);
			User newUser = User.builder()
					.username(username != null ? username : email.split("@")[0])
					.email(email)
					.password(passwordEncoder.encode("google-oauth-user"))
					.role(Role.USER)
					.points(0)
					.build();
			userRepository.save(newUser);
		}
		
		User user = userRepository.findByEmail(email)
				.orElseThrow(() -> new Exception("Google user not found"));
		
		String jwtToken = jwtService.generateToken(user);
		return new AuthResponse(jwtToken);
	}
}
