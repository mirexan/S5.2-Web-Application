package com.boticarium.backend.application.dto.order;

import com.boticarium.backend.domain.model.OrderStatus;
import jakarta.validation.constraints.NotNull;

public record OrderStatusRequest(
		@NotNull(message = "New status is mandatory")
		OrderStatus status
) {
}
