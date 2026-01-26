package com.boticarium.backend.application.dto.order;

import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record OrderRequest (
		@NotEmpty(message = "Order must not be empty")
		List<OrderItemRequest> items
){
}
