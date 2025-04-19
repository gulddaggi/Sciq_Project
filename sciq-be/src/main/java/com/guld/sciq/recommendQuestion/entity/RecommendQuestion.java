package com.guld.sciq.recommendQuestion.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Getter;

@Entity
@Getter
@Table(uniqueConstraints = {@UniqueConstraint(columnNames = {"questionId", "userId"})})
public class RecommendQuestion {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Column(nullable = false)
	private Long questionId;
	
	@Column(nullable = false)
	private Long userId;
	
	public RecommendQuestion() {
	}
	
	public RecommendQuestion(Long questionId, Long userId) {
		this.questionId = questionId;
		this.userId = userId;
	}
}
