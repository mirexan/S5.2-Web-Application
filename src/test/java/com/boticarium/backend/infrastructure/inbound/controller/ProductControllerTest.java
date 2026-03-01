package com.boticarium.backend.infrastructure.inbound.controller;

import com.boticarium.backend.application.dto.product.*;
import com.boticarium.backend.application.service.ProductService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.data.domain.PageImpl;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ProductController.class)
@AutoConfigureMockMvc(addFilters = false) // Desactivamos seguridad por ahora para centrarnos en el controlador
class ProductControllerTest {

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private ObjectMapper objectMapper;

	@MockitoBean
	private ProductService productService;

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
	void getAllProducts_ShouldReturnPage() throws Exception {
		// Given
		var page = new PageImpl<>(List.of(responseSample));
		when(productService.getProductsPublicPage(anyInt(), anyInt(), anyString(), anyString()))
				.thenReturn(page);

		// When & Then
		mockMvc.perform(get("/products")
						.param("page", "0")
						.param("size", "20"))
				.andExpect(status().isOk())
				.andExpect(content().contentType(MediaType.APPLICATION_JSON))
				.andExpect(jsonPath("$.content[0].name").value("Test Product"));
	}

	@Test
	void getAllProductsAdmin_ShouldReturnPage() throws Exception {
		var page = new PageImpl<>(List.of(adminResponseSample));
		when(productService.getProductsPublicPage(anyInt(), anyInt(), anyString(), anyString()))
				.thenReturn(page);
	}

	@Test
	void getProduct_ShouldReturnProduct() throws Exception {
		// Given
		Long id = 1L;
		when(productService.getProductByIdPublic(id)).thenReturn(responseSample);

		// When & Then
		mockMvc.perform(get("/products/1"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.id").value(id))
				.andExpect(jsonPath("$.name").value("Test Product"));
	}

	@Test
	void createProduct_ShouldReturnCreated() throws Exception {
		// Given
		when(productService.createProduct(any(ProductRequest.class))).thenReturn(adminResponseSample);

		// When & Then
		mockMvc.perform(post("/products")
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(requestSample)))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.name").value("Admin Product"));
	}

	@Test
	void deleteProduct_ShouldReturnNoContent() throws Exception {
		// When & Then
		mockMvc.perform(delete("/products/1"))
				.andExpect(status().isNoContent());
	}
}