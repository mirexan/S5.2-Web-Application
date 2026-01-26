package com.boticarium.backend.infrastructure.outbound.persistance;

import com.boticarium.backend.domain.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
	List<Order> findUserById(Long UserId);
}
