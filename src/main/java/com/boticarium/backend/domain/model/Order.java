package com.boticarium.backend.domain.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
@Slf4j
@Entity
@Table(name = "orders")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Order {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id", nullable = false)
	private User user;

	@OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
	@Builder.Default
	private List<OrderItem> items = new ArrayList<>();

	@Column(nullable = false)
	private BigDecimal totalPrice;

	@Enumerated(EnumType.STRING)
	private OrderStatus status;

	@CreationTimestamp
	private LocalDateTime createdAt;

	@UpdateTimestamp
	private LocalDateTime updatedAt;

	public void addItem(OrderItem item) {
		if (this.items == null) {
			this.items = new ArrayList<>();
		}
		items.add(item);
		item.setOrder(this);
	}
	public void removeItem(OrderItem item) {
		items.remove(item);
		item.setOrder(null);
	}
	public void calculateTotalPrice() {
		this.totalPrice = this.items.stream()
				.map(OrderItem::getSubTotal)
				.reduce(BigDecimal.ZERO,BigDecimal::add);
	}
	public void markAsCompleted(){
		if (this.status == OrderStatus.COMPLETED){
			return;
		}
		this.status = OrderStatus.COMPLETED;
		if(this.user != null){
			int currentLevel = this.user.getLevel();
			this.user.addPoints(this.totalPrice.intValue());
			if(this.user.getLevel() > currentLevel){
				log.info("🌿 Congratulations! You level up from " + currentLevel
						+ " to " + this.user.getLevel());
			}
		}
	}
	public void cancel(){
		if(this.status == OrderStatus.CANCELED){
			return;
		}
		this.status = OrderStatus.CANCELED;
		if(this.items != null){
			this.items.forEach(OrderItem::restoreStock);
		}
	}
}
