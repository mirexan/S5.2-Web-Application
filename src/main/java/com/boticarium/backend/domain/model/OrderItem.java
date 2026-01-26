package com.boticarium.backend.domain.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "order_items")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderItem {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "order_id")
	private Order order;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "product_id")
	private Product product;

	private Integer quantity;

	@Column(nullable = false)
	private BigDecimal priceAtPurchase;

	public BigDecimal getSubTotal(){
		if (priceAtPurchase == null || quantity == null){
			return BigDecimal.ZERO;
		}
		return priceAtPurchase.multiply(BigDecimal.valueOf(quantity));
	}
}
