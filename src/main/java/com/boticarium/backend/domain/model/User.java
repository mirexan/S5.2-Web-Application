package com.boticarium.backend.domain.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Entity
@Data
@Table(name = "users")
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class User implements UserDetails {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private String password;
	@Column(nullable = false, unique = true)
	private String username;
	@Column(unique = true, nullable = false)
	private String email;

	@Column(nullable = false)
	private String phone;

	@Enumerated(EnumType.STRING)
	private Role role;

	@Builder.Default
	private Integer points = 0;
	
	/**
	 * Calcula el nivel del usuario basado en sus puntos:
	 * - Nivel 1: 0-199 puntos
	 * - Nivel 2: 200-499 puntos
	 * - Nivel 3: 500+ puntos
	 */
	public int getLevel(){
		if(this.points >= 500){
			return 3;
		}
		if(this.points >= 200){
			return 2;
		}
		return 1;
	}
	
	public void addPoints(int amount){
		if (amount > 0){
			this.points += amount;
		}
	}

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
	}

	@Override
	public boolean isAccountNonExpired() {
		return true;
	}
	@Override
	public boolean isAccountNonLocked() {
		return true;
	}
	@Override
	public boolean isCredentialsNonExpired() {
		return true;
	}
	@Override
	public boolean isEnabled() {
		return true;
	}

}
