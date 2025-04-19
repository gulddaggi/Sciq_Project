package com.guld.sciq.user.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.guld.sciq.config.BaseEntity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.EqualsAndHashCode;

@Entity
@Getter
@ToString(callSuper = true)
@EqualsAndHashCode(callSuper = true)
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "user_tb")
public class User extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonIgnore
    @Column
    private Long id;
    
    @Column(nullable = false)
    private String email;
    
    @Column(nullable = false)
    @JsonIgnore
    private String password;
    
    @Column(nullable = false)
    private String userName;

    @Column(nullable = false)
    private String nickName;
    
    @Column(nullable = true)
    private String schoolName;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserPrefer prefer;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role;
    
    @Column(nullable = false)
    @Builder.Default
    private int points = 0;

    @Column(nullable = false)
    @Builder.Default
    private int level = 1;

    public void updateProfile(String userName, String nickName, String schoolName) {
        this.userName = userName;
        this.nickName = nickName;
        this.schoolName = schoolName;
    }

    public void updatePassword(String newPassword) {
        this.password = newPassword;
    }

    public void updatePrefer(UserPrefer prefer) {
        this.prefer = prefer;
    }

    public void addPoints(int points) {
        this.points += points;
        updateLevel();
    }

    private void updateLevel() {
        // 레벨 업데이트 로직 구현
        // 예: 100포인트당 1레벨
        this.level = (this.points / 100) + 1;
    }
}
