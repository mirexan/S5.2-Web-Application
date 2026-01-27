package com.boticarium.backend.application.dto.product;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;

public record ProductAdminResponse (
		Long id,
		String name,
		String description,
		String imgUrl,
		String ingredients,
		String usageInstructions,

		BigDecimal basePrice,
		BigDecimal costPrice,
		BigDecimal profitMargin,

		Integer discountLevel1,
		Integer discountLevel2,
		Integer discountLevel3,

		Integer stockQuantity,
		String stockStatus,
		LocalDateTime createdAt,
		LocalDateTime updatedAt,
		Map<String, Object> attributes
) {
}
