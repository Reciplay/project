package com.e104.reciplay.user.instructor.dto.response;

import com.e104.reciplay.s3.dto.response.ResponseFileInfo;
import com.e104.reciplay.user.instructor.dto.response.item.InstructorQuestion;
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
    private Integer totalReviewCount;
    private Integer subscriberCount;
    private ResponseFileInfo profileFileInfo;
    private List<InstructorQuestion> newQuestions;
}
