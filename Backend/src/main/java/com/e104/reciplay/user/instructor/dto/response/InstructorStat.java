package com.e104.reciplay.user.instructor.dto.response;

import com.e104.reciplay.user.instructor.dto.response.item.QnaDetail;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class InstructorStat {
    private Integer totalStudents;
    private Double averageStars;
    private Integer tatalReviewCount;
    private Integer subscriberCount;
    private String profileImageUrl;
//    private List<SubscriberHistory> subscriberHistories;
    private List<QnaDetail> newQuestions;
}
