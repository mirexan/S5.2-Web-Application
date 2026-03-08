package com.boticarium.backend.infrastructure.inbound.controller;

import com.boticarium.backend.application.dto.product.*;
import com.boticarium.backend.application.service.ProductService;
import com.boticarium.backend.infrastructure.security.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.PageImpl;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ProductController.class)
@Import({SecurityConfig.class, JwtAuthenticationFilter.class,
		CustomAccessDeniedHandler.class, CustomAuthenticationEntryPoint.class})
@AutoConfigureMockMvc()
class ProductControllerTest {

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private ObjectMapper objectMapper;

	@MockitoBean
	private ProductService productService;

	@MockitoBean
	private JwtService jwtService;

	@MockitoBean
	private UserDetailsService userDetailsService;

	@MockitoBean
	private AuthenticationProvider authenticationProvider;

	@MockitoBean
	private CustomAccessDeniedHandler accessDeniedHandler;

	@MockitoBean
	private CustomAuthenticationEntryPoint authenticationEntryPoint;

	private ProductResponse responseSample;
	private ProductAdminResponse adminResponseSample;
	private ProductRequest requestSample;

	@BeforeEach
	void setUp() {
		responseSample = new ProductResponse(
				1L, "Test Product", "Description", "url", "ing",
				"inst", BigDecimal.TEN, 100, "IN_STOCK",
				0, 0, 0, Map.of()
		);

		adminResponseSample = new ProductAdminResponse(
				1L, "Admin Product", "Desc", "url", "ing", "inst",
				BigDecimal.TEN, BigDecimal.ONE, BigDecimal.TEN,
				0, 0, 0, 10, "IN_STOCK", null, null, Map.of()
		);

		requestSample = new ProductRequest(
				"New Product", "Desc", "url", "ing", "inst",
				BigDecimal.valueOf(20.0), BigDecimal.valueOf(10.0),
				0, 0, 0, 50, Map.of()
		);
	}

	@Test
	@DisplayName("GET /products - Debe devolver página pública (Anónimo OK)")
	@WithMockUser(roles = "USER")
	void getAllProducts_ShouldReturnPage() throws Exception {
		var page = new PageImpl<>(List.of(responseSample));
		when(productService.getProductsPublicPage(anyInt(), anyInt(), anyString(), anyString()))
				.thenReturn(page);

		mockMvc.perform(get("/products")
						.param("page", "0")
						.param("size", "20"))
				.andExpect(status().isOk()); // permitAll() funciona
	}

	@Test
	@DisplayName("GET /products/management - Debe devolver página de administración (Requiere ADMIN)")
	@WithMockUser(roles = "ADMIN") // Añadimos el rol necesario
	void getAllProductsAdmin_ShouldReturnPage() throws Exception {
		var page = new PageImpl<>(List.of(adminResponseSample));
		when(productService.getProductsAdminPage(anyInt(), anyInt(), anyString(), anyString()))
				.thenReturn(page);

		mockMvc.perform(get("/products/management")
						.param("page", "0")
						.param("size", "10"))
				.andExpect(status().isOk());
	}

	@Test
	@DisplayName("GET /products/1 - Debe ser público (SIN WithMockUser)")
	void getProduct_ShouldReturnProduct() throws Exception {
		when(productService.getProductByIdPublic(1L)).thenReturn(responseSample);

		// Sin WithMockUser y sin CSRF (los GET no suelen llevarlo)
		mockMvc.perform(get("/products/1"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.name").value("Test Product"));	}

	@Test
	@DisplayName("POST /products - Debe crear producto (Requiere ADMIN)")
	@WithMockUser(roles = "ADMIN") // Añadimos el rol necesario
	void createProduct_ShouldReturnCreated() throws Exception {
		when(productService.createProduct(any(ProductRequest.class))).thenReturn(adminResponseSample);

		mockMvc.perform(post("/products")
						.with(csrf())
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(requestSample)))
				.andExpect(status().isCreated());
	}

	@Test
	@DisplayName("PUT /products/{id} - Debe actualizar y devolver 200")
	@WithMockUser(roles = "ADMIN")
	void updateProduct_ShouldReturnOk() throws Exception {
		when(productService.updateProduct(eq(1L), any(ProductRequest.class))).thenReturn(adminResponseSample);

		mockMvc.perform(put("/products/1")
						.with(csrf())
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(requestSample)))
				.andExpect(status().isOk());
	}

	@Test
	@DisplayName("DELETE /products/{id} - Debe borrar (Requiere ADMIN)")
	@WithMockUser(roles = "ADMIN") // Añadimos el rol necesario
	void deleteProduct_ShouldReturnNoContent() throws Exception {
		mockMvc.perform(delete("/products/1")
						.with(csrf()))
				.andExpect(status().isNoContent());
	}

	@Test
	@DisplayName("DELETE /products/1 - Debe devolver 403 si el usuario es USER y no ADMIN")
	@WithMockUser(roles = "USER") // Simulamos un usuario normal
	void deleteProduct_AsUser_ShouldReturnForbidden() throws Exception {
		mockMvc.perform(delete("/products/1").with(csrf()))
				.andExpect(status().isForbidden()); // Esperamos un 403
	}

	@Test
	@DisplayName("POST /products - Debe devolver 201 si el usuario es ADMIN")
	@WithMockUser(roles = "ADMIN") // Simulamos el administrador
	void createProduct_AsAdmin_ShouldReturnCreated() throws Exception {
		when(productService.createProduct(any())).thenReturn(adminResponseSample);

		mockMvc.perform(post("/products")
						.with(csrf())
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(requestSample)))
				.andExpect(status().isCreated());
	}

	@Test
	@DisplayName("GET /products/management - Debe devolver 401 si es Anónimo")
	void getAllProductsAdmin_AsAnonymous_ShouldReturnUnauthorized() throws Exception {
		mockMvc.perform(get("/products/management"))
				.andExpect(status().isUnauthorized()); // O isForbidden según tu EntryPoint
	}
}