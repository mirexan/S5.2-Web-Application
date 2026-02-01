package com.boticarium.backend.application.dto.order;

import java.math.BigDecimal;
import java.util.List;

/**
 * Request para crear una orden (checkout)
 */
public record CheckoutRequest(
    List<CheckoutItemRequest> items  // [{ productId: 1, quantity: 2 }, ...]
) {
}

/**
 * Item individual en el checkout
 */
record CheckoutItemRequest(
    Long productId,
    Integer quantity
) {
}
