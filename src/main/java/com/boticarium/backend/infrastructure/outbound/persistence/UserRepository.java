package com.boticarium.backend.infrastructure.outbound.persistence;

import java.util.List;

import com.boticarium.backend.domain.model.Role;
import com.boticarium.backend.domain.model.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
	Optional<User> findByUsername(String username);
	Optional<User> findByEmail(String email);
	Optional<User> findByUsernameAndDeletedFalse(String username);
	Optional<User> findByEmailAndDeletedFalse(String email);
	List<User> findAllByDeletedFalse();
	boolean existsByUsername(String username);
	boolean existsByEmail(String email);
	long countByRole(Role role);
	long countByRoleAndDeletedFalse(Role role);
	@Modifying
@Transactional
@Query("""
DELETE FROM User u
WHERE u.deleted = true
  AND NOT EXISTS (
    SELECT 1 FROM Order o WHERE o.user.id = u.id
  )
""")
int hardDeleteSoftDeletedUsersWithoutOrders();
}
