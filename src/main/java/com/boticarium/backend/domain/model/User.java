package com.boticarium.backend.domain.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users")
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class User {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private String password;
	@Column(nullable = false)
	private String userName;
	@Column(unique = true, nullable = false)
	private String email;

	@Enumerated(EnumType.STRING)
	private Role role;

	@Builder.Default
	private Integer points = 0;
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
}
