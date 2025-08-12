package com.e104.reciplay.user.subscription.service;

import com.e104.reciplay.course.courses.service.SubFileMetadataQueryService;
import com.e104.reciplay.entity.FileMetadata;
import com.e104.reciplay.entity.Subscription;
import com.e104.reciplay.repository.InstructorRepository;
import com.e104.reciplay.repository.SubSubscriptionRepository;
import com.e104.reciplay.s3.dto.response.ResponseFileInfo;
import com.e104.reciplay.s3.service.S3Service;
import com.e104.reciplay.user.subscription.dto.SubscriptionInfo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
@Service
@Slf4j
public class SubscriptionQueryServiceImpl implements SubscriptionQueryService {
    private final SubSubscriptionRepository subscriptionRepository;
//    private final InstructorQueryService instructorQueryService; 순환 참조
    private final SubscriptionHistoryQueryService subscriptionHistoryQueryService;
    private final SubFileMetadataQueryService subFileMetadataQueryService;
    private final S3Service s3Service;
    private final InstructorRepository instructorRepository;

    @Override
    public List<Subscription> querySubscriptionsByUserId(Long userId) {
        return subscriptionRepository.findByUserId(userId);
    }

    @Override
    public Long countSubscribers(Long instructorId) {
        return subscriptionRepository.countByInstructorId(instructorId);
    }

    @Override
    public boolean isSubscribedInstructor(Long instructorId, Long userId) {
        return subscriptionRepository.findByInstructorIdAndUserId(instructorId, userId).orElse(null) != null;
    }

    @Override
    public List<SubscriptionInfo> queryUserSubscriptionsByUserId(Long userId) {
        List<SubscriptionInfo> subscriptionInfos = new ArrayList<>();
        log.debug("해당 유저 구독 정보 조회");
        List<Subscription> subscriptions = subscriptionRepository.findAllByUserId(userId);

        log.debug("해당 유저 구독 정보 리스트를 SubscriptionInfo 리스트로 변환");
        for(Subscription s : subscriptions){
            SubscriptionInfo subscriptionInfo = new SubscriptionInfo();

            log.debug("해당 강사의 사용자 아이디 조회");
//            Long instructorUserId = instructorQueryService.queryInstructorById(s.getInstructorId()).getUserId(); 순환 참조
            Long instructorUserId = instructorRepository.findById(s.getInstructorId()).get().getUserId();

            log.debug("해당 강사의 userProfileFileMetadata 조회");
            FileMetadata fileMetadata = subFileMetadataQueryService.queryMetadataByCondition(instructorUserId, "user_profile");
            log.debug("해당 강사의 responseFIleInfo 생성");
            ResponseFileInfo responseFileInfo = s3Service.getResponseFileInfo(fileMetadata);
            subscriptionInfo.setInstructorProfileFileInfo(responseFileInfo);

            subscriptionInfo.setInstructorId(s.getInstructorId());
            log.debug("해당 강사의 이름 조회 후 subscriptionInfo에 대입");
//            subscriptionInfo.setInstructorName(instructorQueryService.queryNameByInstructorId(s.getInstructorId()));
            subscriptionInfo.setInstructorName(instructorRepository.findNameById(s.getInstructorId()));
            log.debug("해당 강사의 구독자 수 조회 후 subscriptionInfo에 대입");
            subscriptionInfo.setSubscriberCount(subscriptionHistoryQueryService.querySubscriberCount(s.getInstructorId()));

            subscriptionInfos.add(subscriptionInfo);
        }
        return subscriptionInfos;
    }
}
