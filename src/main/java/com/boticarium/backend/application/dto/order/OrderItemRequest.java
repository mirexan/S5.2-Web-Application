package com.boticarium.backend.application.dto.order;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record OrderItemRequest(
		@NotNull(message = "Product id is mandatory")
		Long productId,
		@Min(value = 1, message = "Quantity must be at least 1")
		Integer quantity
) {
}
