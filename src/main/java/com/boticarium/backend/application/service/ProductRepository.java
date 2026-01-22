package com.boticarium.backend.application.service;

import com.boticarium.backend.domain.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

interface ProductRepository extends JpaRepository<Product, Long> {
}
