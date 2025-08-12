package com.e104.reciplay.user.subscription.service;

import com.e104.reciplay.course.courses.service.SubFileMetadataQueryService;
import com.e104.reciplay.entity.FileMetadata;
import com.e104.reciplay.entity.Instructor;
import com.e104.reciplay.entity.Subscription;
import com.e104.reciplay.repository.InstructorRepository;
import com.e104.reciplay.repository.SubSubscriptionRepository;
import com.e104.reciplay.s3.dto.response.ResponseFileInfo;
import com.e104.reciplay.s3.service.S3Service;
import com.e104.reciplay.user.subscription.dto.SubscriptionInfo;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.BDDMockito.*;
import static org.mockito.Mockito.verifyNoInteractions;

@ExtendWith(MockitoExtension.class)
class SubscriptionQueryServiceImplTest {

    @Mock private SubSubscriptionRepository subscriptionRepository;
    @Mock private SubscriptionHistoryQueryService subscriptionHistoryQueryService;
    @Mock private SubFileMetadataQueryService subFileMetadataQueryService;
    @Mock private S3Service s3Service;
    @Mock private InstructorRepository instructorRepository;

    private SubscriptionQueryServiceImpl sut; // System Under Test

    @BeforeEach
    void setUp() {
        // ctor 순서: subscriptionRepository, subscriptionHistoryQueryService, subFileMetadataQueryService, s3Service, instructorRepository
        sut = new SubscriptionQueryServiceImpl(
                subscriptionRepository,
                subscriptionHistoryQueryService,
                subFileMetadataQueryService,
                s3Service,
                instructorRepository
        );
    }

    @Test
    @DisplayName("querySubscriptionsByUserId: 레포지토리 결과 그대로 반환")
    void querySubscriptionsByUserId() {
        Long userId = 1L;
        Subscription s1 = mock(Subscription.class);
        Subscription s2 = mock(Subscription.class);
        given(subscriptionRepository.findByUserId(userId)).willReturn(List.of(s1, s2));

        List<Subscription> result = sut.querySubscriptionsByUserId(userId);

        assertThat(result).hasSize(2).containsExactly(s1, s2);
        then(subscriptionRepository).should().findByUserId(userId);
        verifyNoMoreInteractions(subscriptionRepository);
    }

    @Test
    @DisplayName("countSubscribers: 강사 구독자 수 카운트 반환")
    void countSubscribers() {
        Long instructorId = 10L;
        given(subscriptionRepository.countByInstructorId(instructorId)).willReturn(5L);

        Long count = sut.countSubscribers(instructorId);

        assertThat(count).isEqualTo(5L);
        then(subscriptionRepository).should().countByInstructorId(instructorId);
        verifyNoMoreInteractions(subscriptionRepository);
    }

    @Nested
    @DisplayName("isSubscribedInstructor")
    class IsSubscribedInstructor {

        @Test
        @DisplayName("구독 기록이 있으면 true")
        void subscribed_true() {
            Long instructorId = 10L, userId = 7L;
            given(subscriptionRepository.findByInstructorIdAndUserId(instructorId, userId))
                    .willReturn(Optional.of(mock(Subscription.class)));

            boolean result = sut.isSubscribedInstructor(instructorId, userId);

            assertThat(result).isTrue();
            then(subscriptionRepository).should().findByInstructorIdAndUserId(instructorId, userId);
        }

        @Test
        @DisplayName("구독 기록이 없으면 false")
        void subscribed_false() {
            Long instructorId = 10L, userId = 7L;
            given(subscriptionRepository.findByInstructorIdAndUserId(instructorId, userId))
                    .willReturn(Optional.empty());

            boolean result = sut.isSubscribedInstructor(instructorId, userId);

            assertThat(result).isFalse();
            then(subscriptionRepository).should().findByInstructorIdAndUserId(instructorId, userId);
        }
    }

    @Nested
    @DisplayName("queryUserSubscriptionsByUserId")
    class QueryUserSubscriptionsByUserId {

        @Test
        @DisplayName("유저가 구독한 강사 목록을 SubscriptionInfo 리스트로 조립해 반환")
        void assemble_subscription_infos() {
            Long userId = 1L;

            Subscription sub1 = mock(Subscription.class);
            Subscription sub2 = mock(Subscription.class);
            given(sub1.getInstructorId()).willReturn(100L);
            given(sub2.getInstructorId()).willReturn(200L);
            given(subscriptionRepository.findAllByUserId(userId)).willReturn(List.of(sub1, sub2));

            // InstructorRepository 스텁
            Instructor inst1 = mock(Instructor.class);
            Instructor inst2 = mock(Instructor.class);
            given(inst1.getUserId()).willReturn(1000L);
            given(inst2.getUserId()).willReturn(2000L);
            given(instructorRepository.findById(100L)).willReturn(Optional.of(inst1));
            given(instructorRepository.findById(200L)).willReturn(Optional.of(inst2));
            given(instructorRepository.findNameById(100L)).willReturn("Alice");
            given(instructorRepository.findNameById(200L)).willReturn("Bob");

            // 파일/S3
            FileMetadata fm1 = mock(FileMetadata.class);
            FileMetadata fm2 = mock(FileMetadata.class);
            given(subFileMetadataQueryService.queryMetadataByCondition(1000L, "user_profile")).willReturn(fm1);
            given(subFileMetadataQueryService.queryMetadataByCondition(2000L, "user_profile")).willReturn(fm2);

            ResponseFileInfo r1 = mock(ResponseFileInfo.class);
            ResponseFileInfo r2 = mock(ResponseFileInfo.class);
            given(s3Service.getResponseFileInfo(fm1)).willReturn(r1);
            given(s3Service.getResponseFileInfo(fm2)).willReturn(r2);

            // 구독자 수
            given(subscriptionHistoryQueryService.querySubscriberCount(100L)).willReturn(11);
            given(subscriptionHistoryQueryService.querySubscriberCount(200L)).willReturn(22);

            List<SubscriptionInfo> result = sut.queryUserSubscriptionsByUserId(userId);

            assertThat(result).hasSize(2);

            SubscriptionInfo info1 = result.get(0);
            assertThat(info1.getInstructorId()).isEqualTo(100L);
            assertThat(info1.getInstructorName()).isEqualTo("Alice");
            assertThat(info1.getSubscriberCount()).isEqualTo(11L); // Long/Integer 변환은 DTO 정의에 맞게 유지
            assertThat(info1.getInstructorProfileFileInfo()).isSameAs(r1);

            SubscriptionInfo info2 = result.get(1);
            assertThat(info2.getInstructorId()).isEqualTo(200L);
            assertThat(info2.getInstructorName()).isEqualTo("Bob");
            assertThat(info2.getSubscriberCount()).isEqualTo(22L);
            assertThat(info2.getInstructorProfileFileInfo()).isSameAs(r2);

            then(subscriptionRepository).should().findAllByUserId(userId);
            then(instructorRepository).should().findById(100L);
            then(instructorRepository).should().findById(200L);
            then(subFileMetadataQueryService).should().queryMetadataByCondition(1000L, "user_profile");
            then(subFileMetadataQueryService).should().queryMetadataByCondition(2000L, "user_profile");
            then(s3Service).should().getResponseFileInfo(fm1);
            then(s3Service).should().getResponseFileInfo(fm2);
            then(instructorRepository).should().findNameById(100L);
            then(instructorRepository).should().findNameById(200L);
            then(subscriptionHistoryQueryService).should().querySubscriberCount(100L);
            then(subscriptionHistoryQueryService).should().querySubscriberCount(200L);
        }

        @Test
        @DisplayName("구독 목록이 비어있으면 빈 리스트 반환하고 다른 의존성은 호출되지 않아야 함")
        void empty_list() {
            Long userId = 1L;
            given(subscriptionRepository.findAllByUserId(userId)).willReturn(List.of());

            List<SubscriptionInfo> result = sut.queryUserSubscriptionsByUserId(userId);

            assertThat(result).isEmpty();
            then(subscriptionRepository).should().findAllByUserId(userId);

            // 다른 의존성 전혀 호출되지 않아야 함
            verifyNoInteractions(
                    instructorRepository,
                    subFileMetadataQueryService,
                    s3Service,
                    subscriptionHistoryQueryService
            );
        }
    }
}
