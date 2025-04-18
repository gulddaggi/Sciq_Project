
package com.guld.sciq.recommendQuestion;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.guld.sciq.recommendQuestion.entity.RecommendQuestion;

public interface RecommendQuestionRepository extends JpaRepository<RecommendQuestion, Long> {
    boolean existsByQuestionIdAndUserId(Long questionId, Long userId);

    void deleteByQuestionIdAndUserId(Long questionId, Long userId);

    //user Id 로 추천한 질문 id 조회
    List<RecommendQuestion> findAllByUserId(Long userId);
}