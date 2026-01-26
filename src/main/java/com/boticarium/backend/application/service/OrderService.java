package com.boticarium.backend.application.service;

import com.boticarium.backend.application.dto.order.OrderItemRequest;
import com.boticarium.backend.application.dto.order.OrderRequest;
import com.boticarium.backend.application.dto.order.OrderResponse;
import com.boticarium.backend.application.mapper.OrderMapper;
import com.boticarium.backend.domain.model.*;
import com.boticarium.backend.infrastructure.outbound.persistance.OrderRepository;
import com.boticarium.backend.infrastructure.outbound.persistance.ProductRepository;
import com.boticarium.backend.infrastructure.outbound.persistance.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {
	private final OrderRepository orderRepository;
	private final ProductRepository productRepository;
	private final UserRepository userRepository;
	private final OrderMapper orderMapper;

	@Transactional
	public OrderResponse createOrder(Long userId,OrderRequest request) {
		User user = finUserOrThrow(userId);
		Order order = initializeOrder(user);
		request.items().forEach(itemRequest -> {
			order.addItem(processOrderItem(itemRequest));
		});
		order.calculateTotalPrice();
		return orderMapper.toOrderResponse(orderRepository.save(order));
	}

	public List<OrderResponse> getMyOrders(Long userId) {
		return orderRepository.findUserById(userId).stream()
				.map(orderMapper::toOrderResponse)
				.collect(Collectors.toList());
	}
	public List<OrderResponse> getAllOrders(){
		return orderRepository.findAll().stream()
				.map(orderMapper::toOrderResponse)
				.collect(Collectors.toList());
	}

	private User finUserOrThrow(Long userId) {
		return userRepository.findById(userId)
				.orElseThrow(()-> new EntityNotFoundException("User not found"));
	}
	private Order initializeOrder(User user){
		return Order.builder()
				.user(user)
				.status(OrderStatus.PENDING)
				.build();
	}
	private OrderItem processOrderItem(OrderItemRequest itemRequest){
		Product newProduct = productRepository.findById(itemRequest.productId())
				.orElseThrow(()-> new EntityNotFoundException("Product not found"));
		newProduct.validateStock();
		return OrderItem.builder()
				.product(newProduct)
				.quantity(itemRequest.quantity())
				.priceAtPurchase(newProduct.getBasePrice())
				.build();
	}
}
