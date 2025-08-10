package com.e104.reciplay.user.review.dto.response;

import com.e104.reciplay.entity.Review;
import com.querydsl.core.annotations.QueryProjection;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.format.SignStyle;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ReviewSummary {
    private Long reviewId;
    private String profileImage;
    private String nickname;
    private Long userId;
    private String content;
    private LocalDateTime createdAt;
    private Integer likeCount;

    @QueryProjection
    public ReviewSummary(Long reviewId, String nickname, Long userId, String content, LocalDateTime createdAt, Integer likeCount) {
        this.reviewId = reviewId;
        this.nickname = nickname;
        this.userId = userId;
        this.content = content;
        this.createdAt = createdAt;
        this.likeCount = likeCount;
    }
}
