package com.boticarium.backend.infrastructure.config;

import com.boticarium.backend.infrastructure.outbound.persistence.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Slf4j
@Component
@EnableScheduling
@RequiredArgsConstructor
public class SchedulingConfig {
    private final OrderRepository orderRepository;

    /**
     * Elimina órdenes más antiguas de 1 año (365 días)
     * Se ejecuta diariamente a las 2:00 AM
     */
    @Scheduled(cron = "0 0 2 * * *")
    public void deleteOldOrders() {
        try {
            LocalDateTime oneYearAgo = LocalDateTime.now().minusYears(1);
            long deletedCount = orderRepository.deleteByCreatedAtBefore(oneYearAgo);
            if (deletedCount > 0) {
                log.info("🗑️ Deleted {} old orders (older than 1 year)", deletedCount);
            }
        } catch (Exception e) {
            log.error("❌ Error deleting old orders", e);
        }
    }
}
