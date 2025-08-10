package com.e104.reciplay.user.review.service;

import com.e104.reciplay.entity.Course; 
import com.e104.reciplay.entity.FileMetadata;
import com.e104.reciplay.entity.Review;
import com.e104.reciplay.repository.CourseRepository;
import com.e104.reciplay.repository.ReviewRepository;
import com.e104.reciplay.s3.dto.response.ResponseFileInfo;
import com.e104.reciplay.s3.service.FileMetadataQueryService;
import com.e104.reciplay.s3.service.S3Service;
import com.e104.reciplay.user.review.dto.response.ReviewSummary;
import com.e104.reciplay.user.security.domain.User;
import com.e104.reciplay.user.security.repository.UserRepository;
import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class ReviewQueryServiceImplTest {

    @Autowired
    private ReviewQueryService reviewQueryService;

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private EntityManager entityManager;

    @MockitoBean
    private S3Service s3Service;

    @MockitoBean
    private FileMetadataQueryService fileMetadataQueryService;

    private User user1, user2;
    private Course course1, course2;
    private Review review1, review2, review3;

    @BeforeEach
    void setUp() {
        user1 = User.builder().nickname("user1").email("user1@test.com").password("password").build();
        user2 = User.builder().nickname("user2").email("user2@test.com").password("password").build();
        userRepository.saveAll(List.of(user1, user2));

        course1 = Course.builder().title("Test Course1")
                .courseStartDate(LocalDate.now().minusMonths(1))
                .courseEndDate(LocalDate.now().plusMonths(1))
                .isApproved(true).build();
        course2 = Course.builder().title("Test Course2")
                .courseStartDate(LocalDate.now().minusMonths(1))
                .courseEndDate(LocalDate.now().plusMonths(1))
                .isApproved(true).build();

        courseRepository.saveAll(List.of(course1, course2));

        review1 = Review.builder().userId(user1.getId()).courseId(course1.getId()).stars(5).content("Review 1").likeCount(10).build();
        review2 = Review.builder().userId(user2.getId()).courseId(course1.getId()).stars(3).content("Review 2").likeCount(5).build();
        review3 = Review.builder().userId(user1.getId()).courseId(course2.getId()).stars(1).content("Review 3").likeCount(0).build();
        reviewRepository.saveAll(List.of(review1, review2, review3));
    }

    @Test
    @DisplayName("ID로 리뷰 조회 성공 테스트")
    void queryReviewById_Success() {
        // when
        Review foundReview = reviewQueryService.queryReviewById(review1.getId());

        // then
        assertThat(foundReview).isNotNull();
        assertThat(foundReview.getId()).isEqualTo(review1.getId());
        assertThat(foundReview.getContent()).isEqualTo("Review 1");
    }

    @Test
    @DisplayName("ID로 리뷰 조회 실패 테스트 - 존재하지 않는 리뷰")
    void queryReviewById_Fail_NotFound() {
        // given
        Long nonExistentReviewId = 999L;

        // when & then
        assertThrows(IllegalArgumentException.class, () -> {
            reviewQueryService.queryReviewById(nonExistentReviewId);
        });
    }

    @Test
    @DisplayName("강의 ID로 리뷰 개수 조회 테스트")
    void countReviewsByCourseId() {
        // when
        Integer reviewCount = reviewQueryService.countReviewsByCourseId(course1.getId());

        // then
        assertThat(reviewCount).isEqualTo(2);
    }

    @Test
    @DisplayName("강의 ID로 평균 별점 조회 테스트")
    void avgStarsByCourseId() {
        // when
        Double avgStars = reviewQueryService.avgStarsByCourseId(course1.getId());

        // then
        assertThat(avgStars).isEqualTo(4.0);
    }

    @Test
    @DisplayName("리뷰 작성 여부 확인 테스트 - 작성한 경우")
    void isReviewed_True() {
        // when
        Boolean isReviewed = reviewQueryService.isReviewed(course1.getId(), user1.getId());

        // then
        assertThat(isReviewed).isTrue();
    }

    @Test
    @DisplayName("리뷰 작성 여부 확인 테스트 - 작성하지 않은 경우")
    void isReviewed_False() {
        // when
        Boolean isReviewed = reviewQueryService.isReviewed(course2.getId(), user2.getId());

        // then
        assertThat(isReviewed).isFalse();
    }

    @Test
    @DisplayName("강의 리뷰 요약 목록 조회 테스트")
    void queryReviewSummaries() {
        // given
        Pageable pageable = PageRequest.of(0, 5, Sort.by(Sort.Direction.DESC, "likeCount"));
        String mockProfileUrl = "http://example.com/profile.jpg";

        when(fileMetadataQueryService.queryUserProfilePhoto(any(Long.class)))
                .thenReturn(new FileMetadata()); 
        when(s3Service.getResponseFileInfo(any(FileMetadata.class)))
                .thenReturn(new ResponseFileInfo(mockProfileUrl, null, null));

        // when
        List<ReviewSummary> summaries = reviewQueryService.queryReviewSummaries(course1.getId(), pageable);

        // then
        assertThat(summaries).hasSize(2);
        // 정렬 확인 (likeCount 내림차순)
        assertThat(summaries.get(0).getContent()).isEqualTo("Review 1");
        assertThat(summaries.get(0).getLikeCount()).isEqualTo(10);
        assertThat(summaries.get(1).getContent()).isEqualTo("Review 2");
        assertThat(summaries.get(1).getLikeCount()).isEqualTo(5);
        // 프로필 이미지 확인
        assertThat(summaries.get(0).getProfileImage()).isEqualTo(mockProfileUrl);
        assertThat(summaries.get(1).getProfileImage()).isEqualTo(mockProfileUrl);
    }
}
