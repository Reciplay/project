package com.e104.reciplay.user.review.dto.response;

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
    private String imageUrl;
    private String nickname;
    private String content;
    private LocalDateTime createdAt;
    private Integer likeCount;
}
