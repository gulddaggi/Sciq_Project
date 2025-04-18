package com.guld.sciq.question.service;

import com.guld.sciq.question.dto.QuestionCreateDto;
import com.guld.sciq.question.dto.QuestionDto;
import com.guld.sciq.question.dto.QuestionUpdateDto;
import com.guld.sciq.common.enums.ScienceDisciplineType;

import java.util.List;

public interface QuestionService {
    QuestionDto createQuestion(QuestionCreateDto createDto, Long userId);
    QuestionDto getQuestion(Long questionId);
    List<QuestionDto> getAllQuestions();
    QuestionDto updateQuestion(Long questionId, QuestionUpdateDto updateDto, Long userId);
    void deleteQuestion(Long questionId, Long userId);
    void recommendQuestionToggle(Long questionId, Long userId);
    List<QuestionDto> getQuestionsByUser(Long userId);
    List<QuestionDto> getQuestionsByScienceDiscipline(ScienceDisciplineType scienceDiscipline);
    List<QuestionDto> getTopRatedQuestions(int limit);
    List<QuestionDto> getRecentQuestions(int limit);
}