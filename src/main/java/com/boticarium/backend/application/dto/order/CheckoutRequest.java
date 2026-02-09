package com.boticarium.backend.application.dto.order;

import java.math.BigDecimal;
import java.util.List;

public record CheckoutRequest(
    List<CheckoutItemRequest> items
) {
}
