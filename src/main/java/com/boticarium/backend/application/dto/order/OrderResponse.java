package com.boticarium.backend.application.dto.order;

import com.boticarium.backend.domain.model.OrderStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record OrderResponse(
		Long id,
		LocalDateTime createdAt,
		OrderStatus status,
		BigDecimal totalPrice,
		List<OrderItemResponse> items,
		UserOrderInfo user
) {
	public record UserOrderInfo(Long id, String username, String phone) {}
}
