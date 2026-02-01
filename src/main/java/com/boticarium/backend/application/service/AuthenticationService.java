package com.boticarium.backend.application.service;

import com.boticarium.backend.application.dto.auth.AuthResponse;
import com.boticarium.backend.application.dto.auth.GoogleLoginRequest;
import com.boticarium.backend.application.dto.auth.LoginRequest;
import com.boticarium.backend.application.dto.user.RegisterRequest;
import com.boticarium.backend.domain.model.Role;
import com.boticarium.backend.domain.model.User;
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
				.role(Role.ADMIN)
				.points(1000)
				.build();
		userRepository.save(user);
		String jwtToken = jwtService.generateToken(user);
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
		String jwtToken = jwtService.generateToken(user);
		return new AuthResponse(jwtToken);
	}

	/**
	 * Login/Registro automático con Google OAuth
	 * Si el usuario no existe, lo crea automáticamente
	 * Si existe, lo autentica
	 * 
	 * @param request Con el token de Google
	 * @return AuthResponse con nuestro JWT
	 * @throws Exception Si el token de Google es inválido
	 */
	public AuthResponse loginWithGoogle(GoogleLoginRequest request) throws Exception {
		// Verificar el token de Google
		GoogleIdToken.Payload payload = googleOAuthService.verifyGoogleToken(request.getToken());
		
		String email = payload.getEmail();
		String username = (String) payload.get("name");
		
		// Si el usuario no existe, crearlo automáticamente
		if (userRepository.findByEmail(email).isEmpty()) {
			log.info("Creando usuario nuevo desde Google: {}", email);
			User newUser = User.builder()
					.username(username != null ? username : email.split("@")[0])
					.email(email)
					.password(passwordEncoder.encode("google-oauth-user"))  // No usa contraseña
					.role(Role.USER)
					.points(350) // Puntos iniciales para demostración de descuentos (Nivel 2)
					.build();
			userRepository.save(newUser);
		}
		
		// Obtener usuario (nuevo o existente) y generar token
		User user = userRepository.findByEmail(email)
				.orElseThrow(() -> new Exception("No se pudo obtener el usuario de Google"));
		
		String jwtToken = jwtService.generateToken(user);
		return new AuthResponse(jwtToken);
	}
}
