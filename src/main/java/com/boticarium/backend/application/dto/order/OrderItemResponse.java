package com.boticarium.backend.application.dto.order;

import java.math.BigDecimal;

public record OrderItemResponse(
		Long productId,
		String productName,
		Integer quantity,
		BigDecimal priceAtPurchase,
		BigDecimal subTotal
) {
}
