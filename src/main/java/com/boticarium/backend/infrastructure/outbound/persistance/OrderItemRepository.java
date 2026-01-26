package com.boticarium.backend.infrastructure.outbound.persistance;

import com.boticarium.backend.domain.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
}
