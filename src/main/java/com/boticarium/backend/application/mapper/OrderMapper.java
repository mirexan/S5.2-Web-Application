package com.boticarium.backend.application.mapper;

import com.boticarium.backend.application.dto.order.OrderItemResponse;
import com.boticarium.backend.application.dto.order.OrderResponse;
import com.boticarium.backend.domain.model.Order;
import com.boticarium.backend.domain.model.OrderItem;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class OrderMapper {
	public OrderResponse toOrderResponse(Order order) {
		return new OrderResponse(
				order.getId(),
				order.getCreatedAt(),
				order.getStatus(),
				order.getTotalPrice(),
				toItemResponseList(order.getItems()),
				new OrderResponse.UserOrderInfo(
						order.getUser().getId(),
						order.getUser().getUsername(),
						order.getUser().getPhone()
				)
		);
	}
	private List<OrderItemResponse> toItemResponseList(List<OrderItem> items) {
		return items.stream()
				.map(this::toOrderItemResponse)
				.collect(Collectors.toList());
	}
	private OrderItemResponse toOrderItemResponse(OrderItem item) {
		return new OrderItemResponse(
				item.getProduct().getId(),
				item.getProduct().getName(),
				item.getQuantity(),
				item.getPriceAtPurchase(),
				item.getSubTotal()
		);
	}
}
