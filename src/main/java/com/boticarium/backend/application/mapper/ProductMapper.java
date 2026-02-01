package com.boticarium.backend.application.mapper;

import com.boticarium.backend.application.dto.product.ProductAdminResponse;
import com.boticarium.backend.application.dto.product.ProductRequest;
import com.boticarium.backend.application.dto.product.ProductResponse;
import com.boticarium.backend.domain.model.Product;
import com.boticarium.backend.domain.model.StockStatus;
import org.springframework.stereotype.Component;

import java.util.function.Consumer;

@Component
public class ProductMapper {

	public ProductResponse toPublicResponse(Product product){
		return new ProductResponse(
				product.getId(),
				product.getName(),
				product.getDescription(),
				product.getImgUrl(),
				product.getIngredients(),
				product.getUsageInstructions(),
				product.getBasePrice(),
				product.getStockQuantity(),
				product.getStockStatus().name(),
				product.getDiscountLevel1(),
				product.getDiscountLevel2(),
				product.getDiscountLevel3(),
				product.getAdditionalAttributes()
		);
	}

	public ProductAdminResponse toAdminResponse(Product product){
		return new ProductAdminResponse(
				product.getId(),
				product.getName(),
				product.getDescription(),
				product.getImgUrl(),
				product.getIngredients(),
				product.getUsageInstructions(),
				product.getBasePrice(),
				product.getCostPrice(),
				product.getProfitMarginPercent(),
				product.getDiscountLevel1(),
				product.getDiscountLevel2(),
				product.getDiscountLevel3(),
				product.getStockQuantity(),
				product.getStockStatus().name(),
				product.getCreatedAt(),
				product.getUpdatedAt(),
				product.getAdditionalAttributes()
		);
	}
	public Product toProductEntity(ProductRequest request){

		return Product.builder()
				.name(request.name())
				.description(request.description())
				.imgUrl(request.imgUrl())
				.ingredients(request.ingredients())
				.usageInstructions(request.usageInstructions())
				.basePrice(request.basePrice())
				.costPrice(request.costPrice())
				.discountLevel1(request.discountLevel1() != null ? request.discountLevel1():0)
				.discountLevel2(request.discountLevel2() != null ? request.discountLevel2():0)
				.discountLevel3(request.discountLevel3()!= null ? request.discountLevel3():0)
				.stockQuantity(request.stockQuantity() != null ? request.stockQuantity() : 0)
				.stockStatus(calculateStockStatus(request))
				.additionalAttributes(request.additionalAttributes())
				.build();
	}
	private StockStatus calculateStockStatus(ProductRequest request){
		int quantity = request.stockQuantity() != null? request.stockQuantity() : 0;
		return (quantity > 0)?StockStatus.AVAILABLE:StockStatus.OUT_OF_STOCK;
	}

	public void updateProductFromRequest(Product existing, ProductRequest request){
		updateIfNotNull(request.name(),existing::setName);
		updateIfNotNull(request.description(),existing::setDescription);
		updateIfNotNull(request.imgUrl(), existing::setImgUrl);
		updateIfNotNull(request.basePrice(),existing::setBasePrice);
		updateIfNotNull(request.costPrice(), existing::setCostPrice);
		updateIfNotNull(request.discountLevel1(),existing::setDiscountLevel1);
		updateIfNotNull(request.discountLevel2(),existing::setDiscountLevel2);
		updateIfNotNull(request.discountLevel3(),existing::setDiscountLevel3);
		updateIfNotNull(request.stockQuantity(), existing::setStockQuantity);
		updateIfNotNull(request.ingredients(),existing::setIngredients);
		updateIfNotNull(request.usageInstructions(),existing::setUsageInstructions);
		updateIfNotNull(request.additionalAttributes(),existing::setAdditionalAttributes);
	}
	private <T> void updateIfNotNull(T value, Consumer<T> setter){
		if (value != null){
			setter.accept(value);
		}
	}
}
