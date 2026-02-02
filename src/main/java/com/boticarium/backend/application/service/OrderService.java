package com.boticarium.backend.application.service;

import com.boticarium.backend.application.dto.order.OrderItemRequest;
import com.boticarium.backend.application.dto.order.OrderRequest;
import com.boticarium.backend.application.dto.order.OrderResponse;
import com.boticarium.backend.application.mapper.OrderMapper;
import com.boticarium.backend.domain.model.*;
import com.boticarium.backend.infrastructure.outbound.persistence.OrderRepository;
import com.boticarium.backend.infrastructure.outbound.persistence.ProductRepository;
import com.boticarium.backend.infrastructure.outbound.persistence.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
@Slf4j
@Service
@RequiredArgsConstructor
public class OrderService {
	private final OrderRepository orderRepository;
	private final ProductRepository productRepository;
	private final UserRepository userRepository;
	private final OrderMapper orderMapper;

	@Transactional
	public OrderResponse createOrder(Long userId,OrderRequest request) {
		User user = findIdOrThrow(userRepository,userId,"User");
		Order order = initializeOrder(user);
		request.items().forEach(itemRequest -> {
			order.addItem(processOrderItem(itemRequest, user.getLevel()));
		});
		order.calculateTotalPrice();
		return orderMapper.toOrderResponse(orderRepository.save(order));
	}

	public List<OrderResponse> getMyOrders(Long userId) {
		return orderRepository.findAllByUserId(userId).stream()
				.map(orderMapper::toOrderResponse)
				.collect(Collectors.toList());
	}
	public List<OrderResponse> getAllOrders(){
		return orderRepository.findAll().stream()
				.map(orderMapper::toOrderResponse)
				.collect(Collectors.toList());
	}

	public Page<OrderResponse> getAllOrdersPaginated(Pageable pageable) {
		return orderRepository.findAll(pageable)
				.map(orderMapper::toOrderResponse);
	}

	@Transactional
	public OrderResponse updateOrderStatus(Long orderId, OrderStatus newStatus){
		Order orderToUpdate = findIdOrThrow(orderRepository,orderId,"Order");
		if (orderToUpdate.getStatus() == newStatus){
			return orderMapper.toOrderResponse(orderToUpdate);
		}
		switch(newStatus){
			case COMPLETED -> {
				orderToUpdate.markAsCompleted();
				userRepository.save(orderToUpdate.getUser());
				log.info("Order has been updated successfully");
			}
			case CANCELED -> {
				orderToUpdate.cancel();
				orderToUpdate.getItems().forEach(item ->
						productRepository.save(item.getProduct()));
				log.info("Order has been cancelled successfully");
			}
			default -> orderToUpdate.setStatus(newStatus);
		}
		return orderMapper.toOrderResponse(orderRepository.save(orderToUpdate));
	}


	private <T> T findIdOrThrow(JpaRepository<T, Long> repository, Long id, String entityName) {
		return repository.findById(id)
				.orElseThrow(()-> new EntityNotFoundException(entityName
						+ " not found with id : " + id));
	}
	private Order initializeOrder(User user){
		return Order.builder()
				.user(user)
				.status(OrderStatus.PENDING)
				.createdAt(LocalDateTime.now())
				.updatedAt(LocalDateTime.now())
				.build();
	}
	private OrderItem processOrderItem(OrderItemRequest itemRequest, int userLevel){
		Product newProduct = findIdOrThrow(productRepository, itemRequest.productId(), "Product");
		newProduct.decreaseStock(itemRequest.quantity());
		productRepository.save(newProduct);
		logDiscount(newProduct,userLevel);
		return OrderItem.builder()
				.product(newProduct)
				.quantity(itemRequest.quantity())
				.priceAtPurchase(newProduct.getPriceForLevel(userLevel))
				.build();
	}
	private void logDiscount(Product newProduct, int userLevel){
		BigDecimal originalPrice =  newProduct.getBasePrice();
		BigDecimal finalPrice = newProduct.getPriceForLevel(userLevel);
		if (finalPrice.compareTo(originalPrice) < 0){
			BigDecimal discount = originalPrice.subtract(finalPrice);
			log.info("👌Discount applied: User level {} saved {}€", userLevel, discount);
		}
	}
}
