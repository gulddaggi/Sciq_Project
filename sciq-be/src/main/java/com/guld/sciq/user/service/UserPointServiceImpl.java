package com.guld.sciq.user.service;

import com.guld.sciq.global.exception.UserNotFoundException;
import com.guld.sciq.common.error.ErrorMessage;
import com.guld.sciq.user.entity.User;
import com.guld.sciq.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserPointServiceImpl implements UserPointService {
    private final UserRepository userRepository;
    
    private static final int POST_CREATION_POINTS = 3;
    private static final int COMMENT_CREATION_POINTS = 2;
    private static final int RECOMMENDATION_POINTS = 1;
    private static final int RECOMMENDATION_MILESTONE_POINTS = 2;
    private static final int RECOMMENDATION_MILESTONE_COUNT = 10;

    @Override
    @Transactional
    public void addPointForPostCreation(Long userId) {
        User user = getUserById(userId);
        user.addPoints(POST_CREATION_POINTS);
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void addPointForCommentCreation(Long userId) {
        User user = getUserById(userId);
        user.addPoints(COMMENT_CREATION_POINTS);
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void addPointForPostRecommendation(Long userId) {
        User user = getUserById(userId);
        user.addPoints(RECOMMENDATION_POINTS);
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void addPointForRecommendationMilestone(Long userId, int totalRecommendations) {
        // 추천 수가 10의 배수인 경우에만 추가 포인트 부여
        if (totalRecommendations % RECOMMENDATION_MILESTONE_COUNT == 0) {
            User user = getUserById(userId);
            user.addPoints(RECOMMENDATION_MILESTONE_POINTS);
            userRepository.save(user);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public User getUserPointInfo(Long userId) {
        return getUserById(userId);
    }
    
    private User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(ErrorMessage.USER_NOT_FOUND));
    }
} 