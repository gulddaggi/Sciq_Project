package com.guld.sciq.feedback.entity;

import com.guld.sciq.config.BaseEntity;
import com.guld.sciq.question.entity.Question;
import com.guld.sciq.debate.entity.Debate;
import com.guld.sciq.user.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "feedback_tb")
@Getter
@ToString(callSuper = true)
@EqualsAndHashCode(callSuper = true)
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Feedback extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "question_id")
    private Question question;

    @ManyToOne
    @JoinColumn(name = "debate_id")
    private Debate debate;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column
    private String content;

    @Column
    @Builder.Default
    private int helpfulCount = 0;

    @Column
    private LocalDateTime createdAt;

    @Column
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "feedback", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<FeedbackLike> likes = new ArrayList<>();

    public void increaseHelpfulCount() {
        this.helpfulCount++;
    }

    public void decreaseHelpfulCount() {
        if (this.helpfulCount > 0) {
            this.helpfulCount--;
        }
    }

    public void updateContent(String content) {
        this.content = content;
        this.updatedAt = LocalDateTime.now();
    }

    public void addLike(FeedbackLike like) {
        this.likes.add(like);
    }

    public void removeLike(FeedbackLike like) {
        this.likes.remove(like);
    }
} 