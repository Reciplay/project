package com.e104.reciplay.user.instructor.dto.response;

<<<<<<< HEAD
import com.e104.reciplay.s3.dto.response.ResponseFileInfo;
import com.e104.reciplay.user.instructor.dto.response.item.InstructorQuestion;
=======
import com.e104.reciplay.user.instructor.dto.response.item.QnaDetail;
>>>>>>> dev
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
<<<<<<< HEAD
    private ResponseFileInfo profileFileInfo;
    private List<InstructorQuestion> newQuestions;
=======
    private String profileImageUrl;
//    private List<SubscriberHistory> subscriberHistories;
    private List<QnaDetail> newQuestions;
>>>>>>> dev
}
