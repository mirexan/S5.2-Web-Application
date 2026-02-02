package com.boticarium.backend.infrastructure.inbound.controller;

import com.boticarium.backend.application.dto.order.OrderRequest;
import com.boticarium.backend.application.dto.order.OrderResponse;
import com.boticarium.backend.application.dto.order.OrderStatusRequest;
import com.boticarium.backend.application.service.OrderService;
import com.boticarium.backend.domain.model.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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
	public ResponseEntity<Page<OrderResponse>> getAllOrdersHistoryAdmin(
			@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "15") int size,
			@RequestParam(defaultValue = "createdAt,desc") String sort) {
		String[] sortParams = sort.split(",");
		Sort.Direction direction = sortParams.length > 1 && sortParams[1].equalsIgnoreCase("asc") 
			? Sort.Direction.ASC 
			: Sort.Direction.DESC;
		Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortParams[0]));
		return ResponseEntity.ok(orderService.getAllOrdersPaginated(pageable));
	}

	@PatchMapping("/management/{id}/status")
	public ResponseEntity<OrderResponse> updateStatus(@PathVariable Long id,
													  @RequestBody @Valid OrderStatusRequest request){
		return ResponseEntity.ok(orderService.updateOrderStatus(id, request.status()));
	}
}
