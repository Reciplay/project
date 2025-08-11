package com.e104.reciplay.repository.custom;

import com.e104.reciplay.course.qna.dto.response.QnaSummary;
import com.e104.reciplay.user.instructor.dto.response.item.InstructorQuestion;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface CustomQuestionRepository {
    List<QnaSummary> findQuestionSummaryWithQuestioner(Long courseId, Pageable pageable);

    List<InstructorQuestion> findQuestionsByInstructorId(Long instructorId);
}
