package com.boticarium.backend.infrastructure.config;
import com.boticarium.backend.domain.model.Product;
import com.boticarium.backend.domain.model.Role;
import com.boticarium.backend.domain.model.StockStatus;
import com.boticarium.backend.domain.model.User;
import com.boticarium.backend.infrastructure.outbound.persistence.ProductRepository;
import com.boticarium.backend.infrastructure.outbound.persistence.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {
	private final UserRepository userRepository;
	private final ProductRepository productRepository;
	private final PasswordEncoder passwordEncoder;

	@Override
	public void run(String... args) throws Exception {
		if (productRepository.count() == 0) {
			loadUsers();
			loadProducts();
			System.out.println("\uD83C\uDF31 Test data uploaded correctly \uD83C\uDF31");
		}
	}

	private void loadUsers() {
		if (userRepository.findByUsername("admin").isEmpty()) {
			User admin = User.builder()
					.username("admin")
					.email("admin@boticarium.com")
					.password(passwordEncoder.encode("klonoa"))
					.role(Role.ADMIN)
					.points(0)
					.build();
			userRepository.save(admin);
		}
		if (userRepository.findByUsername("Mirexan").isEmpty()) {
			User user = User.builder()
					.username("Mirexan")
					.email("Mirexan@test.com")
					.password(passwordEncoder.encode("klonoa"))
					.role(Role.USER)
					.points(300)
					.build();
			userRepository.save(user);
		}
	}

	private void loadProducts() {
		Product p1 = Product.builder()
				.name("Divasel")
				.description("Te perfuma a alcanfor y te quita todo lo malo")
				.basePrice(new BigDecimal("50.00"))
				.costPrice(new BigDecimal("10.00"))
				.stockQuantity(100) // <--- STOCK INICIAL
				.stockStatus(StockStatus.AVAILABLE) // <--- ESTADO INICIAL
				.imgUrl("http://img.com/crema.jpg")
				.build();


		Product p2 = Product.builder()
				.name("Baba de Chufi")
				.description("Se va a acabar pronto")
				.basePrice(new BigDecimal("20.00"))
				.costPrice(new BigDecimal("5.00"))
				.stockQuantity(2)
				.stockStatus(StockStatus.AVAILABLE)
				.imgUrl("http://img.com/serum.jpg")
				.build();

		productRepository.saveAll(List.of(p1, p2));
	}
}