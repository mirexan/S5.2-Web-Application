package com.boticarium.backend.application.service;

import com.boticarium.backend.application.dto.product.ProductAdminResponse;
import com.boticarium.backend.application.dto.product.ProductRequest;
import com.boticarium.backend.application.dto.product.ProductResponse;
import com.boticarium.backend.application.mapper.ProductMapper;
import com.boticarium.backend.domain.model.Product;
import com.boticarium.backend.infrastructure.outbound.persistence.ProductRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {
	private final ProductMapper mapper;
	private final ProductRepository repository;

	public List<ProductResponse> getAllProductsPublic() {
		return repository.findAll().stream()
				.map(mapper::toPublicResponse)
				.collect(Collectors.toList());
	}

	public ProductResponse getProductByIdPublic(Long id) {
		return mapper.toPublicResponse(findProductOrThrow(id));
	}

	public List<ProductAdminResponse> getAllProductsAdmin() {
		return repository.findAll().stream()
				.map(mapper::toAdminResponse)
				.collect(Collectors.toList());
	}

	public ProductAdminResponse getProductAdminById(Long id) {
		return mapper.toAdminResponse(findProductOrThrow(id));
	}

	@Transactional
	public ProductAdminResponse createProduct(ProductRequest request) {
		Product newProduct = mapper.toProductEntity(request);
		Product savedProduct = repository.save(newProduct);
		return mapper.toAdminResponse(savedProduct);
	}

	@Transactional
	public ProductAdminResponse updateProduct(Long id, ProductRequest request) {
		Product actualProduct = findProductOrThrow(id);
		mapper.updateProductFromRequest(actualProduct, request);
		Product updatedProduct = repository.save(actualProduct);
		return mapper.toAdminResponse(updatedProduct);
	}

	public void deleteProduct(Long id) {
		if(!repository.existsById(id)) {
			throw new EntityNotFoundException("Product not found");
		}
		repository.deleteById(id);
	}

	private Product findProductOrThrow(Long id) {
		return repository.findById(id)
				.orElseThrow(() -> new EntityNotFoundException("Product not found with id " + id));
	}

}
