package com.guld.sciq.recommendQuestion.service;

import java.util.List;

import com.guld.sciq.question.dto.QuestionDto;

public interface RecommendQuestionService {
    void recommendQuestion(Long questionId, Long userId);

    void cancelRecommendQuestion(Long questionId, Long userId);

    boolean isRecommended(Long questionId, Long userId);

    List<QuestionDto> getRecommendedQuestionsByUserId(Long userId);
}