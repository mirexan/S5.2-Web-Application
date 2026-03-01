package com.boticarium.backend.application.service;

import com.boticarium.backend.application.dto.product.ProductAdminResponse;
import com.boticarium.backend.application.dto.product.ProductRequest;
import com.boticarium.backend.application.dto.product.ProductResponse;
import com.boticarium.backend.application.mapper.ProductMapper;
import com.boticarium.backend.domain.model.Product;
import com.boticarium.backend.infrastructure.outbound.persistence.ProductRepository;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

	@Mock
	private ProductRepository repository; // Proxy del repositorio

	@Mock
	private ProductMapper mapper; // Proxy del mapper

	@InjectMocks
	private ProductService productService; // Instancia real con mocks inyectados

	private Product productSample;
	private ProductRequest requestSample;
	private ProductResponse responseSample;
	private ProductAdminResponse adminResponseSample;

	@BeforeEach
	void setUp() {
		productSample = new Product();
		requestSample = new ProductRequest(
				"Product Name", "Description", "http://image.url", "Ingredients", "Instructions",
				BigDecimal.valueOf(100.0), BigDecimal.valueOf(50.0),
				5, 10, 15, 20, Map.of()
		);
		responseSample = new ProductResponse(
				1L, "Product Name", "Description", "url", "ing", "inst",
				BigDecimal.TEN, 100, "IN_STOCK", 0, 0, 0, Map.of()
		);
		adminResponseSample = new ProductAdminResponse(
				1L, "Admin Product", "Desc", "url", "ing", "inst",
				BigDecimal.TEN, BigDecimal.ONE, BigDecimal.TEN,
				0, 0, 0, 10, "IN_STOCK", null, null, Map.of()
		);

	}

	@Test
	void getProductsPublicPage_ShouldReturnPage() {
		int page = 0, size = 10;
		String sortBy = "name", sortDir = "asc";
		Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy).ascending());
		Page<Product> productPage = new PageImpl<>(List.of(new Product()));

		when(repository.findAll(any(Pageable.class))).thenReturn(productPage);
		when(mapper.toPublicResponse(any())).thenReturn(responseSample);

		Page<ProductResponse> result = productService.getProductsPublicPage(page, size, sortBy, sortDir);

		assertNotNull(result);
		verify(repository).findAll(pageable);
	}
	@Test
	void getProductsAdminPage_ShouldReturnPage() {
		// Arrange
		int page = 0, size = 10;
		String sortBy = "id", sortDir = "desc";
		Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy).descending());
		Page<Product> productPage = new PageImpl<>(List.of(productSample));

		when(repository.findAll(any(Pageable.class))).thenReturn(productPage);
		when(mapper.toAdminResponse(any())).thenReturn(adminResponseSample);

		// Act
		Page<ProductAdminResponse> result = productService.getProductsAdminPage(page, size, sortBy, sortDir);

		// Assert
		assertNotNull(result);
		verify(repository).findAll(pageable);
		verify(mapper).toAdminResponse(any());
	}

	@Test
	void getProductByIdPublic_WhenExists_ShouldReturnResponse() {
		Long id = 1L;
		when(repository.findById(id)).thenReturn(Optional.of(productSample));
		when(mapper.toPublicResponse(productSample)).thenReturn(responseSample);

		ProductResponse result = productService.getProductByIdPublic(id);

		assertNotNull(result);
		verify(repository).findById(id);
	}

	@Test
	void getProductByIdPublic_WhenNotExists_ShouldThrowException() {
		Long id = 1L;
		when(repository.findById(id)).thenReturn(Optional.empty());

		assertThrows(EntityNotFoundException.class, () -> productService.getProductByIdPublic(id));
	}

	@Test
	void getAllProductsAdmin_ShouldReturnList() {
		when(repository.findAll()).thenReturn(List.of(productSample));
		when(mapper.toAdminResponse(any())).thenReturn(adminResponseSample);

		List<ProductAdminResponse> result = productService.getAllProductsAdmin();

		assertFalse(result.isEmpty());
		verify(repository).findAll();
	}

	@Test
	void createProduct_ShouldSaveAndReturnAdminResponse() {

		Product savedProduct = new Product();

		when(mapper.toProductEntity(requestSample)).thenReturn(productSample);
		when(repository.save(productSample)).thenReturn(savedProduct);
		when(mapper.toAdminResponse(savedProduct)).thenReturn(adminResponseSample);

		ProductAdminResponse result = productService.createProduct(requestSample);

		assertNotNull(result);
		verify(repository).save(productSample);
	}

	@Test
	void updateProduct_ShouldUpdateNormalizeAndSave() {
		Long id = 1L;
		Product existingProduct = mock(Product.class); // Usamos mock para verificar llamadas a métodos internos

		when(repository.findById(id)).thenReturn(Optional.of(existingProduct));
		when(repository.save(existingProduct)).thenReturn(existingProduct);
		when(mapper.toAdminResponse(existingProduct)).thenReturn(adminResponseSample);

		productService.updateProduct(id, requestSample);

		verify(mapper).updateProductFromRequest(existingProduct, requestSample);
		verify(existingProduct).normalizeStockStatus();
		verify(repository).save(existingProduct);
	}

	@Test
	void deleteProduct_WhenExists_ShouldDelete() {
		Long id = 1L;
		when(repository.existsById(id)).thenReturn(true);

		productService.deleteProduct(id);

		verify(repository).deleteById(id);
	}

	@Test
	void deleteProduct_WhenNotExists_ShouldThrowException() {
		Long id = 1L;
		when(repository.existsById(id)).thenReturn(false);

		assertThrows(EntityNotFoundException.class, () -> productService.deleteProduct(id));
		verify(repository, never()).deleteById(anyLong());
	}
}