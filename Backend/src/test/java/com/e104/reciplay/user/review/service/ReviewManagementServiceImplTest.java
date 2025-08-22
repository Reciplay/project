package com.e104.reciplay.user.review.service;

import com.e104.reciplay.common.exception.InvalidUserRoleException;
import com.e104.reciplay.course.courses.exception.CourseClosedException;
import com.e104.reciplay.entity.*;
import com.e104.reciplay.repository.*;
import com.e104.reciplay.user.lecture_history.service.PersonalStatService;
import com.e104.reciplay.user.review.dto.request.ReviewRequest;
import com.e104.reciplay.user.security.domain.User;
import com.e104.reciplay.user.security.repository.UserRepository;
import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class ReviewManagementServiceImplTest {

    @Autowired
    private ReviewManagementService reviewManagementService;

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private LikeRepository likeRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private ChapterRepository chapterRepository;

    @Autowired
    private LectureRepository lectureRepository;

    @Autowired
    private LectureHistoryRepository lectureHistoryRepository;

    @Autowired
    private EntityManager entityManager;

    @MockitoBean
    private PersonalStatService personalStatService;

    private User user;
    private User otherUser;
    private Course course;
    private Course closedCourse;
    private Review review;

    @BeforeEach
    void setUp() {
        user = User.builder().nickname("testuser").isActivated(true).email("test@test.com").password("password").build();
        otherUser = User.builder().nickname("otheruser").isActivated(true).email("other@test.com").password("password").build();
        userRepository.saveAll(List.of(user, otherUser));

        course = Course.builder().title("Test Course")
                .courseStartDate(LocalDate.now().minusMonths(1))
                .courseEndDate(LocalDate.now().plusMonths(1))
                .isApproved(true).build();
        closedCourse = Course.builder().title("Closed Course")
                .courseStartDate(LocalDate.now().minusMonths(1))
                .courseEndDate(LocalDate.now().minusDays(1))
                .isApproved(false).build();
        courseRepository.saveAll(List.of(course, closedCourse));

        review = Review.builder().userId(user.getId()).courseId(course.getId()).stars(5).content("Great course!").likeCount(0).build();
        reviewRepository.save(review);
    }

    @Test
    @DisplayName("리뷰 삭제 성공 테스트")
    void deleteReview_Success() {
        // given
        long reviewId = review.getId();
        String userEmail = user.getEmail();

        // when
        reviewManagementService.deleteReview(reviewId, userEmail);
        entityManager.flush();
        entityManager.clear();

        // then
        assertThat(reviewRepository.findById(reviewId)).isEmpty();
    }

    @Test
    @DisplayName("리뷰 삭제 실패 테스트 - 권한 없음")
    void deleteReview_Fail_InvalidUser() {
        // given
        long reviewId = review.getId();
        String otherUserEmail = otherUser.getEmail();

        // when & then
        assertThrows(InvalidUserRoleException.class, () -> {
            reviewManagementService.deleteReview(reviewId, otherUserEmail);
        });
    }

    @Test
    @DisplayName("리뷰 삭제 실패 테스트 - 종료된 강좌")
    void deleteReview_Fail_CourseClosed() {
        // given
        Review closedCourseReview = Review.builder().userId(user.getId()).courseId(closedCourse.getId()).stars(5).content("Closed course review").likeCount(0).build();
        reviewRepository.save(closedCourseReview);
        long reviewId = closedCourseReview.getId();
        String userEmail = user.getEmail();

        // when & then
        assertThrows(CourseClosedException.class, () -> {
            reviewManagementService.deleteReview(reviewId, userEmail);
        });
    }

    @Test
    @DisplayName("리뷰 좋아요 성공 테스트")
    void likeReview_Success() {
        // given
        long reviewId = review.getId();
        String otherUserEmail = otherUser.getEmail();

        // when
        reviewManagementService.likeReview(reviewId, otherUserEmail);
        entityManager.flush();
        entityManager.clear();

        // then
        Review updatedReview = reviewRepository.findById(reviewId).get();
        assertThat(updatedReview.getLikeCount()).isEqualTo(1);
        assertThat(likeRepository.findByReviewIdAndUserId(reviewId, otherUser.getId())).isPresent();
    }

    @Test
    @DisplayName("리뷰 좋아요 실패 테스트 - 이미 좋아요 함")
    void likeReview_Fail_AlreadyLiked() {
        // given
        long reviewId = review.getId();
        String userEmail = user.getEmail();
        likeRepository.save(new Like(null, user.getId(), reviewId));

        // when & then
        assertThrows(IllegalArgumentException.class, () -> {
            reviewManagementService.likeReview(reviewId, userEmail);
        });
    }

    @Test
    @DisplayName("리뷰 생성 성공 테스트")
    void createReview_Success() {
        // given
        Course newCourse = Course.builder().title("New Course").isApproved(true).build();
        courseRepository.save(newCourse);
        Mockito.when(personalStatService.calcCourseProgress(Mockito.anyLong(), Mockito.anyString())).thenReturn((0.9));

        ReviewRequest request = new ReviewRequest(newCourse.getId(), 5, "Awesome!");
        String userEmail = user.getEmail();

        // when
        reviewManagementService.createReview(request, userEmail);
        entityManager.flush();
        entityManager.clear();

        // then
        assertThat(reviewRepository.existsByCourseIdAndUserId(newCourse.getId(), user.getId())).isTrue();
    }

    @Test
    @DisplayName("리뷰 생성 실패 테스트 - 진행률 50% 미만")
    void createReview_Fail_ProgressTooLow() {
        // given
        ReviewRequest request = new ReviewRequest(course.getId(), 5, "Not enough progress");
        String userEmail = user.getEmail();
        Mockito.when(personalStatService.calcCourseProgress(Mockito.anyLong(), Mockito.anyString())).thenReturn(0.45);


        // when & then
        assertThrows(IllegalArgumentException.class, () -> {
            reviewManagementService.createReview(request, userEmail);
        });
    }

    @Test
    @DisplayName("리뷰 생성 실패 테스트 - 이미 리뷰 작성함")
    void createReview_Fail_AlreadyExists() {
        // given
        // 100% 수강

        ReviewRequest request = new ReviewRequest(course.getId(), 4, "Another review");
        String userEmail = user.getEmail();

        // when & then
        assertThrows(IllegalArgumentException.class, () -> {
            reviewManagementService.createReview(request, userEmail);
        });
    }

    @Test
    @DisplayName("리뷰 좋아요 취소 성공 테스트")
    void unlikeReview_Success() {
        // given
        long reviewId = review.getId();
        String userEmail = user.getEmail();
        likeRepository.save(new Like(null, user.getId(), reviewId));
        review.setLikeCount(1);
        reviewRepository.save(review);
        entityManager.flush();
        entityManager.clear();

        // when
        reviewManagementService.unlikeReview(reviewId, userEmail);
        entityManager.flush();
        entityManager.clear();

        // then
        Review updatedReview = reviewRepository.findById(reviewId).get();
        assertThat(updatedReview.getLikeCount()).isEqualTo(0);
        assertThat(likeRepository.findByReviewIdAndUserId(reviewId, user.getId())).isEmpty();
    }

    @Test
    @DisplayName("리뷰 좋아요 취소 실패 테스트 - 좋아요하지 않은 리뷰")
    void unlikeReview_Fail_NotLiked() {
        // given
        long reviewId = review.getId();
        String userEmail = user.getEmail();

        // when & then
        assertThrows(IllegalArgumentException.class, () -> {
            reviewManagementService.unlikeReview(reviewId, userEmail);
        });
    }
}