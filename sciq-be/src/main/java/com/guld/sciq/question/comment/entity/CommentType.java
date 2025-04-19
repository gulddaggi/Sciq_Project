package com.guld.sciq.question.comment.entity;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum CommentType {
    OPINION,    // 학생(STUDENT)의 의견
    ADVISE;     // 조언자(ADVISOR)의 조언

    /**
     * 문자열을 CommentType으로 변환합니다.
     * 대소문자를 구분하지 않고 변환합니다.
     * 
     * @param value 변환할 문자열
     * @return 변환된 CommentType 또는 값이 null이거나 일치하지 않을 경우 기본값(OPINION)
     */
    @JsonCreator
    public static CommentType fromString(String value) {
        if (value == null) {
            return OPINION; // 기본값
        }
        
        try {
            return CommentType.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            // 일치하는 값이 없을 경우 기본값 반환
            return OPINION;
        }
    }
}