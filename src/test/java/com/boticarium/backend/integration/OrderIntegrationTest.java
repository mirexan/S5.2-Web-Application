package com.boticarium.backend.integration;

import com.boticarium.backend.application.dto.order.OrderRequest;
import com.boticarium.backend.application.dto.order.OrderItemRequest;
import com.boticarium.backend.domain.model.Product;
import com.boticarium.backend.domain.model.Role;
import com.boticarium.backend.domain.model.User;
import com.boticarium.backend.infrastructure.outbound.persistence.ProductRepository;
import com.boticarium.backend.infrastructure.outbound.persistence.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
public class OrderIntegrationTest {

	@Autowired
	private MockMvc mockMvc;
	@Autowired
	private ProductRepository productRepository;
	@Autowired
	private UserRepository userRepository;
	@Autowired
	private ObjectMapper objectMapper;
	private Long productId;
	private User testUser;

	@BeforeEach
	public void setup(){
		Product product = Product.builder()
				.name("Sal zero test")
				.basePrice(new BigDecimal("6.00"))
				.stockQuantity(20)
				.stockStatus(com.boticarium.backend.domain.model.StockStatus.AVAILABLE)
				.description("Test description")
				.build();
		productRepository.save(product);
		this.productId = product.getId();

		testUser = User.builder()
				.username("testclient")
				.email("test@client.com")
				.password("password123") // No importa mucho en el test mockeado
				.role(Role.USER)
				.points(0)
				.build();
		userRepository.save(testUser);
	}

	@Test
	@DisplayName("Should create and order when user is logged")
	@WithMockUser(username = "user", roles = {"USER"})
	void createOrder_ShouldSucceed_WhenStockIsAvailable() throws Exception {

		OrderItemRequest itemRequest = new OrderItemRequest(productId, 2);
		OrderRequest orderRequest = new OrderRequest(List.of(itemRequest));

		mockMvc.perform(post("/orders")
						.with(user(testUser))
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(orderRequest)))

				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.status").value("PENDING"))
				.andExpect(jsonPath("$.totalPrice").value(12.00));
	}
	@Test
	@DisplayName("Try to make an order without logging should fail (403)")
	void createOrder_ShouldFail_WhenAnonymous() throws Exception {

		OrderItemRequest itemRequest = new OrderItemRequest(productId, 1);
		OrderRequest orderRequest = new OrderRequest(List.of(itemRequest));

		mockMvc.perform(post("/orders")
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(orderRequest)))

				.andExpect(status().isUnauthorized()); // O isUnauthorized()
	}
}
