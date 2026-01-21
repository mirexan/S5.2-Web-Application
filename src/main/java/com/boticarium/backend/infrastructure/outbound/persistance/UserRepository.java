package com.boticarium.backend.infrastructure.outbound.persistance;

import com.boticarium.backend.domain.model.Role;
import com.boticarium.backend.domain.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
	Optional<User> findByUsername(String username);
	boolean existsByUsername(String username);
	boolean existsByEmail(String email);
	long countByRole(Role role);
}
