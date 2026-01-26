package com.boticarium.backend.infrastructure.inbound.controller;

import com.boticarium.backend.application.dto.product.ProductAdminResponse;
import com.boticarium.backend.application.dto.product.ProductRequest;
import com.boticarium.backend.application.dto.product.ProductResponse;
import com.boticarium.backend.application.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
public class ProductController {

	private final ProductService service;

	@GetMapping
	public ResponseEntity<List<ProductResponse>> getAllProducts() {
		return ResponseEntity.ok(service.getAllProductsPublic());
	}

	@GetMapping("/{id}")
	public ResponseEntity<ProductResponse> getProduct(@PathVariable Long id) {
		return ResponseEntity.ok(service.getProductByIdPublic(id));
	}

	@GetMapping("/management")
	public ResponseEntity<List<ProductAdminResponse>> getAllProductsAdmin() {
		return ResponseEntity.ok(service.getAllProductsAdmin());
	}

	@GetMapping("/management/{id}")
	public ResponseEntity<ProductAdminResponse> getProductAdmin(@PathVariable Long id) {
		return ResponseEntity.ok(service.getProductAdminById(id));
	}
	@PostMapping
	public ResponseEntity<ProductAdminResponse> createProduct(@Valid @RequestBody ProductRequest request) {
		ProductAdminResponse newProduct = service.createProduct(request);
		return ResponseEntity.status(HttpStatus.CREATED).body(newProduct);
	}

	@PutMapping("/{id}")
	public ResponseEntity<ProductAdminResponse> updateProduct(@PathVariable Long id,
															  @Valid @RequestBody ProductRequest request) {
		return ResponseEntity.ok(service.updateProduct(id, request));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
		service.deleteProduct(id);
		return ResponseEntity.noContent().build();
	}
}
