package com.boticarium.backend.application.dto.product;

import java.math.BigDecimal;
import java.util.Map;

public record ProductResponse (
		Long id,
		String name,
		String description,
		String imgUrl,
		String ingredients,
		String usageInstructions,
		BigDecimal basePrice,
		String stockStatus,
		Map<String, Object> attributes
) {
}
