package com.guld.sciq.question.comment.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;

@Builder
public record QuestionCommentCreateDto(
    @Schema(description = "댓글 내용", example = "좋은 질문이네요!")
    String content
) {}