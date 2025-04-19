package com.guld.sciq.recommendQuestion.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.guld.sciq.common.error.ErrorMessage;
import com.guld.sciq.global.exception.RecommendException;
import com.guld.sciq.question.dto.QuestionDto;
import com.guld.sciq.question.repository.QuestionRepository;
import com.guld.sciq.recommendQuestion.RecommendQuestionRepository;
import com.guld.sciq.recommendQuestion.entity.RecommendQuestion;
import com.guld.sciq.recommendQuestion.service.RecommendQuestionService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RecommendQuestionServiceImpl implements RecommendQuestionService {
	private final RecommendQuestionRepository recommendQuestionRepository;
	private final QuestionRepository questionRepository;
	
	@Override
	public void recommendQuestion(Long questionId, Long userId) {
		if (recommendQuestionRepository.existsByQuestionIdAndUserId(questionId, userId)) {
			throw new RecommendException(ErrorMessage.RECOMMEND_QUESTION_ALREADY_EXISTS);
		}
		
		RecommendQuestion recommendQuestion = new RecommendQuestion(questionId, userId);
		recommendQuestionRepository.save(recommendQuestion);
	}
	
	@Override
	public void cancelRecommendQuestion(Long questionId, Long userId) {
		if (!recommendQuestionRepository.existsByQuestionIdAndUserId(questionId, userId)) {
			throw new RecommendException(ErrorMessage.RECOMMEND_QUESTION_NOT_FOUND);
		}
		
		recommendQuestionRepository.deleteByQuestionIdAndUserId(questionId, userId);
	}
	
	@Override
	public boolean isRecommended(Long questionId, Long userId) {
		return recommendQuestionRepository.existsByQuestionIdAndUserId(questionId, userId);
	}
	
	@Override
	public List<QuestionDto> getRecommendedQuestionsByUserId(Long userId) {
		// 리스트 순회하면서 questionId 를 가져와서 Question 객체 repository 에서 가져와서 QuestionDto 로 변환
		 return recommendQuestionRepository.findAllByUserId(userId)
				.stream()
				.map(recommendQuestion -> {
					return questionRepository.findById(recommendQuestion.getQuestionId())
							.map(QuestionDto::from)
							.orElseThrow(() -> new RecommendException(ErrorMessage.QUESTION_NOT_FOUND));
				})
				.collect(Collectors.toList());
	}
}
