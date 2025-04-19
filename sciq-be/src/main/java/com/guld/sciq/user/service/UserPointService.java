package com.guld.sciq.user.service;

import com.guld.sciq.user.entity.User;

public interface UserPointService {
    /**
     * 게시글 작성 시 포인트 추가 (3점)
     */
    void addPointForPostCreation(Long userId);

    /**
     * 댓글 작성 시 포인트 추가 (2점)
     */
    void addPointForCommentCreation(Long userId);

    /**
     * 게시글 추천 받았을 때 포인트 추가 (1점)
     */
    void addPointForPostRecommendation(Long userId);
    
    /**
     * 게시글 추천 수가 10개 단위로 증가할 때 추가 포인트 부여 (2점)
     */
    void addPointForRecommendationMilestone(Long userId, int totalRecommendations);
    
    /**
     * 사용자의 현재 포인트와 레벨 정보 조회
     */
    User getUserPointInfo(Long userId);
} 