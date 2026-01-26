package com.boticarium.backend.domain.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Entity
@Table(name = "products")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Product {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private String name;

	@Column(columnDefinition = "TEXT")
	private String description;

	private String imgUrl;

	@Column(nullable = false)
	private BigDecimal basePrice;

	@Column(nullable = true)
	private BigDecimal costPrice;

	@Builder.Default
	private Integer discountLevel1 = 0;
	@Builder.Default
	private Integer discountLevel2 = 0;
	@Builder.Default
	private Integer discountLevel3 = 0;

	@Enumerated(EnumType.STRING)
	private StockStatus stockStatus;

	@Column(columnDefinition = "TEXT")
	private String ingredients;

	@Column(columnDefinition = "TEXT")
	private String usageInstructions;

	@CreationTimestamp
	@Column(updatable = false)
	private LocalDateTime createdAt;
	@UpdateTimestamp
	private LocalDateTime updatedAt;

	@JdbcTypeCode(SqlTypes.JSON)
	@Column(columnDefinition = "jsonb")
	@Builder.Default
	private Map<String, Object> additionalAttributes = new HashMap<>();

	public BigDecimal getPriceForLevel(int userLevel){
		Integer discountPercentage = getDiscountPercentage(userLevel);
		if (discountPercentage == 0){
			return this.basePrice;
		}
		BigDecimal factor = BigDecimal.valueOf(discountPercentage)
				.divide(BigDecimal.valueOf(100),2, RoundingMode.HALF_UP);
		BigDecimal discountAmount = basePrice.multiply(factor);
		return basePrice.subtract(discountAmount)
				.setScale(2, RoundingMode.HALF_UP);
	}
	public Integer getDiscountPercentage(int userLevel){
		if (userLevel >= 3){
			return this.discountLevel3;
		}
		return switch (userLevel) {
			case 1 -> this.discountLevel1;
			case 2-> this.discountLevel2;
			default-> 0;
		};
	}
	public BigDecimal getProfitMarginPercent(){
		if(basePrice == null || costPrice == null
				|| basePrice.compareTo(BigDecimal.ZERO) == 0 || costPrice.compareTo(BigDecimal.ZERO) == 0){
			return BigDecimal.ZERO;
		}
		BigDecimal netoProfit = basePrice.subtract(costPrice);
		return netoProfit.divide(basePrice, 4, RoundingMode.HALF_UP)
				.multiply(BigDecimal.valueOf(100))
				.setScale(2, RoundingMode.HALF_UP);
	}
	public void validateStock(){
		if (this.stockStatus == StockStatus.OUT_OF_STOCK){
			throw new IllegalStateException(this.name + " is out of stock");
		}
	}
}
