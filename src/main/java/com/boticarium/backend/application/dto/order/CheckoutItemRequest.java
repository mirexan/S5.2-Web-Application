package com.boticarium.backend.application.dto.order;

public record CheckoutItemRequest(
		Long productId,
		Integer quantity
) {
}

