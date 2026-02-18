package com.boticarium.backend.infrastructure.config;

import com.boticarium.backend.infrastructure.outbound.persistence.OrderRepository;
import com.boticarium.backend.infrastructure.outbound.persistence.UserRepository;

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
    private final UserRepository userRepository;

    @Scheduled(cron = "0 0 2 * * *")
    public void deleteOldOrders() {
        try {
            LocalDateTime oneYearAgo = LocalDateTime.now().minusYears(1);

            long deletedOrders = orderRepository.deleteByCreatedAtBefore(oneYearAgo);
            if (deletedOrders > 0) {
                log.info("Deleted {} old orders (older than 1 year)", deletedOrders);
            }
            int deletedUsers = userRepository.hardDeleteSoftDeletedUsersWithoutOrders();
            if (deletedUsers > 0) {
                log.info("Deleted {} soft-deleted users without orders", deletedUsers);
            }
        } 
        catch (Exception e) {
            log.error("Error deleting old orders and purging users", e);
        }
    }
}
