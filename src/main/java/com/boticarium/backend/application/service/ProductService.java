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

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;


import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {
	private final ProductMapper mapper;
	private final ProductRepository repository;

	@Cacheable(value = "products_public_page", key = "#page + '-' + #size + '-' + #sortBy + '-' + #sortDir")
	public Page<ProductResponse> getProductsPublicPage(int page, int size, String sortBy, String sortDir) {
		Sort sort = sortDir.equalsIgnoreCase("desc")
				? Sort.by(sortBy).descending()
				: Sort.by(sortBy).ascending();

		Pageable pageable = PageRequest.of(page, size, sort);

		return repository.findAll(pageable)
				.map(mapper::toPublicResponse);
	}

	public Page<ProductAdminResponse> getProductsAdminPage(int page, int size, String sortBy, String sortDir) {
		Sort sort = sortDir.equalsIgnoreCase("desc")
				? Sort.by(sortBy).descending()
				: Sort.by(sortBy).ascending();

		Pageable pageable = PageRequest.of(page, size, sort);

		return repository.findAll(pageable)
				.map(mapper::toAdminResponse); // Usamos el mapper de admin
	}

	@Cacheable("product_public_by_id")
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
	@CacheEvict(cacheNames = {"products_public_list", "product_public_by_id", "products_public_page"}, allEntries = true)
	public ProductAdminResponse createProduct(ProductRequest request) {
		Product newProduct = mapper.toProductEntity(request);
		Product savedProduct = repository.save(newProduct);
		return mapper.toAdminResponse(savedProduct);
	}

	@Transactional
	@CacheEvict(cacheNames = {"products_public_list", "product_public_by_id", "products_public_page"}, allEntries = true)
	public ProductAdminResponse updateProduct(Long id, ProductRequest request) {
		Product actualProduct = findProductOrThrow(id);
		mapper.updateProductFromRequest(actualProduct, request);
		actualProduct.normalizeStockStatus();
		return mapper.toAdminResponse(repository.save(actualProduct));
	}

	@CacheEvict(cacheNames = {"products_public_list", "product_public_by_id", "products_public_page"}, allEntries = true)
	public void deleteProduct(Long id) {
		if (!repository.existsById(id)) {
			throw new EntityNotFoundException("Product not found");
		}
		repository.deleteById(id);
	}

	private Product findProductOrThrow(Long id) {
		return repository.findById(id)
				.orElseThrow(() -> new EntityNotFoundException("Product not found with id " + id));
	}

}
