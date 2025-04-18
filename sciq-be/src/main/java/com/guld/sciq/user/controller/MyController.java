package com.guld.sciq.user.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.guld.sciq.question.service.QuestionService;
import com.guld.sciq.recommendQuestion.service.RecommendQuestionService;
import com.guld.sciq.security.UserPrincipal;
import com.guld.sciq.utils.ApiUtils;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@Tag(name = "마이페이지", description = "마이페이지 API")
@RestController
@RequestMapping("/v1/mypage")
@RequiredArgsConstructor
public class MyController {

    private final RecommendQuestionService recommendQuestionService;
    // getRecommendedQuestionsByUserId
    // 마이페이지 - 내가 추천한 질문들 조회
    @Operation(summary = "내가 추천한 질문들 조회", description = "내가 추천한 질문들을 조회합니다.")
    @GetMapping("/recommended-questions")
    public ResponseEntity<?> getRecommendedQuestionsByUserId(
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        return ResponseEntity.ok(ApiUtils.success(recommendQuestionService.getRecommendedQuestionsByUserId(userPrincipal.getId())));
    }

}
