package com.e104.reciplay.user.instructor.service;

import com.e104.reciplay.repository.CourseHistoryRepository;
import com.e104.reciplay.repository.ReviewRepository;
import com.e104.reciplay.user.instructor.repository.SubscriptionRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class InstructorStatQueryServiceImplTest {

    @Mock private CourseHistoryRepository courseHistoryRepository;
    @Mock private ReviewRepository reviewRepository;
    @Mock private SubscriptionRepository subscriptionRepository;

    @InjectMocks
    private InstructorStatQueryServiceImpl service;

    @Test
    @DisplayName("queryTotalStudents: 리포지토리 위임 및 값 전달")
    void queryTotalStudents_ok() {
        Long instructorId = 10L;
        when(courseHistoryRepository.countInstructorTotalStudentsByInstructorId(instructorId))
                .thenReturn(123);

        Integer result = service.queryTotalStudents(instructorId);

        assertThat(result).isEqualTo(123);
        verify(courseHistoryRepository).countInstructorTotalStudentsByInstructorId(instructorId);
        verifyNoMoreInteractions(courseHistoryRepository, reviewRepository, subscriptionRepository);
    }

    @Test
    @DisplayName("queryAvgStars: 리포지토리 위임 및 값 전달")
    void queryAvgStars_ok() {
        Long instructorId = 11L;
        when(reviewRepository.avgInstructorStarsByInstructorId(instructorId))
                .thenReturn(4.5);

        Double result = service.queryAvgStars(instructorId);

        assertThat(result).isEqualTo(4.5);
        verify(reviewRepository).avgInstructorStarsByInstructorId(instructorId);
        verifyNoMoreInteractions(courseHistoryRepository, reviewRepository, subscriptionRepository);
    }

    @Test
    @DisplayName("queryAvgStars: 리포지토리가 null 반환 시 그대로 null")
    void queryAvgStars_null_passthrough() {
        Long instructorId = 12L;
        when(reviewRepository.avgInstructorStarsByInstructorId(instructorId))
                .thenReturn(null);

        Double result = service.queryAvgStars(instructorId);

        assertThat(result).isNull();
        verify(reviewRepository).avgInstructorStarsByInstructorId(instructorId);
        verifyNoMoreInteractions(courseHistoryRepository, reviewRepository, subscriptionRepository);
    }

    @Test
    @DisplayName("queryTotalReviewCount: 리포지토리 위임 및 값 전달")
    void queryTotalReviewCount_ok() {
        Long instructorId = 13L;
        when(reviewRepository.countInstructorTotalReviewByInstructorId(instructorId))
                .thenReturn(87);

        Integer result = service.queryTotalReviewCount(instructorId);

        assertThat(result).isEqualTo(87);
        verify(reviewRepository).countInstructorTotalReviewByInstructorId(instructorId);
        verifyNoMoreInteractions(courseHistoryRepository, reviewRepository, subscriptionRepository);
    }

    @Test
    @DisplayName("querySubsciberCount: 리포지토리 위임 및 값 전달")
    void querySubsciberCount_ok() {
        Long instructorId = 14L;
        when(subscriptionRepository.countInstructorSubscriberByInstrcutorId(instructorId))
                .thenReturn(456);

        Integer result = service.querySubsciberCount(instructorId);

        assertThat(result).isEqualTo(456);
        verify(subscriptionRepository).countInstructorSubscriberByInstrcutorId(instructorId);
        verifyNoMoreInteractions(courseHistoryRepository, reviewRepository, subscriptionRepository);
    }
}
