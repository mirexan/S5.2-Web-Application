package com.boticarium.backend.infrastructure.config;

import com.boticarium.backend.domain.model.Role;
import com.boticarium.backend.domain.model.User;
import com.boticarium.backend.infrastructure.outbound.persistance.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;

	@Override
	public void run(String... args){
		if (!userRepository.existsByUsername("admin")) {
			User admin = User.builder()
					.username("admin")
					.password(passwordEncoder.encode("klonoa"))
					.email("admin@boticarium.com")
					.role(Role.ADMIN)
					.points(1000)
					.build();
			userRepository.save(admin);
			System.out.println("Initial admin account has been created: admin / klonoa");
		}
	}
}
