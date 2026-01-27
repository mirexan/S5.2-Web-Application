package com.boticarium.backend.application.dto.product;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;

import java.math.BigDecimal;
import java.util.Map;

public record ProductRequest(
		String name,
		String description,
		String imgUrl,
		String ingredients,
		String usageInstructions,
		@Positive(message = "Price must be bigger than 0")
		BigDecimal basePrice,
		@PositiveOrZero(message = "Cost can't be negative")
		BigDecimal costPrice,
		@PositiveOrZero(message = "Discount can't be negative")
		Integer discountLevel1,
		@PositiveOrZero(message = "Discount can't be negative")
		Integer discountLevel2,
		@PositiveOrZero(message = "Discount can't be negative")
		Integer discountLevel3,
		Integer stockQuantity,
		String stockStatus,
		Map<String, Object>additionalAttributes
) {
}
