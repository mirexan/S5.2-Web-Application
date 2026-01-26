package com.boticarium.backend.infrastructure.inbound.controller;

import com.boticarium.backend.application.dto.order.OrderRequest;
import com.boticarium.backend.application.dto.order.OrderResponse;
import com.boticarium.backend.application.service.OrderService;
import com.boticarium.backend.domain.model.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
public class OrderController {
	private final OrderService orderService;

	@PostMapping
	public ResponseEntity<OrderResponse> createOrder(@RequestBody @Valid OrderRequest request,
													 @AuthenticationPrincipal User user) {
		OrderResponse response = orderService.createOrder(user.getId(),  request);
		return ResponseEntity.status(HttpStatus.CREATED).body(response);
	}

	@GetMapping("/my-orders")
	public ResponseEntity<List<OrderResponse>> getMyHistory(@AuthenticationPrincipal User user) {
		return ResponseEntity.ok(orderService.getMyOrders(user.getId()));
	}

	@GetMapping("/management")
	public ResponseEntity<List<OrderResponse>> getAllOrdersHistoryAdmin(){
		return ResponseEntity.ok(orderService.getAllOrders());
	}
}
