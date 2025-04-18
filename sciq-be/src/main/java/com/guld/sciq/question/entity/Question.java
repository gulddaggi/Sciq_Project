package com.guld.sciq.question.entity;

import com.guld.sciq.config.BaseEntity;
import com.guld.sciq.common.enums.ScienceDisciplineType;
import com.guld.sciq.user.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "question_tb")
@Getter
@ToString(callSuper = true)
@EqualsAndHashCode(callSuper = true)
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Question extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String title;

    @Column
    private String content;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ScienceDisciplineType scienceDiscipline;

    @Column
    @Builder.Default
    private Integer recommendCnt = 0;

    public void updateQuestion(String title, String content, ScienceDisciplineType scienceDiscipline) {
        this.title = title;
        this.content = content;
        this.scienceDiscipline = scienceDiscipline;
    }

    public void incrementRecommendCnt() {
        this.recommendCnt++;
    }

    public void decrementRecommendCnt() {
        if (this.recommendCnt > 0) {
            this.recommendCnt--;
        }
    }

}