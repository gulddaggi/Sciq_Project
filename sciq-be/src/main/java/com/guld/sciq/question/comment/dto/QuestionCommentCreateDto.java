package com.guld.sciq.question.comment.dto;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.guld.sciq.question.comment.entity.CommentType;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuestionCommentCreateDto {
    @Schema(description = "댓글 내용", example = "좋은 질문이네요!")
    private String content;

    @Schema(description = "댓글 타입", example = "OPINION", implementation = CommentType.class)
    private CommentType commentType;

    /**
     * 문자열 commentType을 CommentType enum으로 설정하는 메서드
     * @param commentTypeStr 문자열 타입
     */
    @JsonProperty("commentType")
    public void setCommentTypeFromString(String commentTypeStr) {
        this.commentType = CommentType.fromString(commentTypeStr);
    }
}