package com.e104.reciplay.livekit.service.depends;

import com.e104.reciplay.course.courses.service.SubFileMetadataQueryService;
import com.e104.reciplay.course.qna.service.QnaQueryService;
import com.e104.reciplay.entity.*;
import com.e104.reciplay.repository.InstructorRepository;
import com.e104.reciplay.s3.dto.response.ResponseFileInfo;
import com.e104.reciplay.s3.service.S3Service;
import com.e104.reciplay.user.instructor.dto.response.InstructorProfile;
import com.e104.reciplay.user.instructor.dto.response.InstructorStat;
import com.e104.reciplay.user.instructor.dto.response.item.CareerItem;
import com.e104.reciplay.user.instructor.dto.response.item.InstructorQuestion;
import com.e104.reciplay.user.instructor.dto.response.item.LicenseItem;
import com.e104.reciplay.user.instructor.service.CareerQueryService;
import com.e104.reciplay.user.instructor.service.InstructorLicenseQueryService;
import com.e104.reciplay.user.instructor.service.InstructorStatQueryService;
import com.e104.reciplay.user.instructor.service.LicenseQueryService;
import com.e104.reciplay.user.security.domain.User;
import com.e104.reciplay.user.security.exception.EmailNotFoundException;
import com.e104.reciplay.user.security.service.UserQueryService;
import com.e104.reciplay.user.subscription.dto.SubscribedInstructorItem;
import com.e104.reciplay.user.subscription.service.SubscriptionHistoryService;
import com.e104.reciplay.user.subscription.service.SubscriptionQueryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class InstructorQueryServiceImpl implements InstructorQueryService{
    private final UserQueryService userQueryService;
    private final InstructorRepository instructorRepository;
    private final SubFileMetadataQueryService subFileMetadataQueryService;
    private final S3Service s3Service;
    private final InstructorLicenseQueryService instructorLicenseQueryService;
    private final CareerQueryService careerQueryService;
    private final LicenseQueryService licenseQueryService;
    private final SubscriptionQueryService subscriptionQueryService;
    private final InstructorStatQueryService instructorStatQueryService;
    private final QnaQueryService qnaQueryService;
    private final SubscriptionHistoryService subscriptionHistoryService;
    @Override
    public Instructor queryInstructorByEmail(String email) {
        User user = userQueryService.queryUserByEmail(email);
        return instructorRepository.findByUserId(user.getId()).orElseThrow(()->new IllegalArgumentException("강사가 아닌 유저의 이메일 입니다."));
    }

    @Override
    public Long queryInstructorIdByEmail(String email) {
        return instructorRepository.findIdByEmail(email);
    }

    @Override
    public String queryNameByInstructorId(Long instructorId) {
        return instructorRepository.findNameById(instructorId);
    }

    @Override
    public Instructor queryInstructorById(Long instructorId) {
        return instructorRepository.findById(instructorId).orElseThrow(()->new EmailNotFoundException("전달된 instructorId를 찾을 수 없습니다. (instructorId : "+instructorId+")"));
    }

    @Override
    public InstructorProfile queryInstructorProfile(Long instructorId, Long userId) {
        Instructor instructor = instructorRepository.findById(instructorId).orElseThrow(()->new EmailNotFoundException("전달된 강사을 찾을 수 없습니다. (강사Id : "+instructorId+")"));

        // InstructorProfile 인스턴스 생성
        InstructorProfile instructorProfile = new InstructorProfile();

        // 강사 프로필 이미지 찾기
        FileMetadata instructorProfileMetadata = subFileMetadataQueryService.queryMetadataByCondition(instructor.getUserId(), "user_profile");
        ResponseFileInfo instructorProfileFileInfo = s3Service.getResponseFileInfo(instructorProfileMetadata);

        // 강사 배너 이미지 찾기
        FileMetadata instructorBannerMetadata = subFileMetadataQueryService.queryMetadataByCondition(instructorId, "instructor_banner");
        ResponseFileInfo instructorBannerFileInfo =s3Service.getResponseFileInfo(instructorBannerMetadata);

        // licenseItemList 설정
        List<LicenseItem> licenseItems = new ArrayList<>();
        List<InstructorLicense> licenses = instructorLicenseQueryService.queryLicensesByInstructorId(instructorId);
        for(InstructorLicense license : licenses){
            LicenseItem item = new LicenseItem(license);
            item.setLicenseName(licenseQueryService.queryLicenseById(license.getLicenseId()).getName());
            licenseItems.add(item);
        }

        // careerItemList 설정
        List<CareerItem> careerItems = new ArrayList<>();
        List<Career> careers = careerQueryService.queryCarrersByInstructorId(instructorId);
        for(Career career : careers){
            CareerItem item = new CareerItem(career);
            careerItems.add(item);
        }


        // instructorProfile 값 설정
        instructorProfile.setInstructorProfileFileInfo(instructorProfileFileInfo);
        instructorProfile.setInstructorBannerFileInfo(instructorBannerFileInfo);
        instructorProfile.setCareers(careerItems);
        instructorProfile.setLicenses(licenseItems);
        instructorProfile.setIsSubscribed(subscriptionQueryService.isSubscribedInstructor(instructorId, userId));
        instructorProfile.setSubscriberCount(subscriptionQueryService.countSubscribers(instructorId).intValue());
        instructorProfile.setName(instructorRepository.findNameById(instructorId));
        instructorProfile.setIntroduction(instructor.getIntroduction());

        return instructorProfile;
    }

    @Override
    public InstructorStat queryInstructorStatistic(Long instructorId) {
        InstructorStat instructorStat = new InstructorStat();
        Integer totalStudents = instructorStatQueryService.queryTotalStudents(instructorId);
        Double averageStars = instructorStatQueryService.queryAvgStars(instructorId);
        Integer totalReviewCount = instructorStatQueryService.queryTotalReviewCount(instructorId);
        Integer subscriberCount = instructorStatQueryService.querySubsciberCount(instructorId);

        FileMetadata profileMetadata = subFileMetadataQueryService.queryMetadataByCondition(instructorId, "user_profile");
        ResponseFileInfo profileFileInfo = s3Service.getResponseFileInfo(profileMetadata);

        List<InstructorQuestion> newQuestions = qnaQueryService.queryQuestionsByInstructorId(instructorId);
        instructorStat.setAverageStars(averageStars);
        instructorStat.setSubscriberCount(subscriberCount);
        instructorStat.setTotalReviewCount(totalReviewCount);
        instructorStat.setNewQuestions(newQuestions);
        instructorStat.setProfileFileInfo(profileFileInfo);
        instructorStat.setTotalStudents(totalStudents);
        return  instructorStat;
    }

    @Override
    public Instructor queryInstructorByUserId(Long userId) {
        return instructorRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("강사로 등록되지 않은 회원입니다."));
    }

    @Override
    public List<SubscribedInstructorItem> queryUserSubscriptionsByUserId(Long userId) {
        List<SubscribedInstructorItem> subscribedInstructorItems = new ArrayList<>();
        log.debug("해당 유저 구독 정보 조회");
        List<Subscription> subscriptions = subscriptionQueryService.querySubscriptionsByUserId(userId);
        log.debug("해당 유저 구독 정보 리스트를 SubscriptionInfo 리스트로 변환");

        for(Subscription s : subscriptions){
            SubscribedInstructorItem item = new SubscribedInstructorItem();

            log.debug("해당 강사의 사용자 아이디 조회");
            Long instructorUserId = instructorRepository.findById(s.getInstructorId()).get().getUserId();

            log.debug("해당 강사의 userProfileFileMetadata 조회");
            FileMetadata fileMetadata = subFileMetadataQueryService.queryMetadataByCondition(instructorUserId, "user_profile");
            log.debug("해당 강사의 responseFIleInfo 생성");
            ResponseFileInfo responseFileInfo = s3Service.getResponseFileInfo(fileMetadata);
            item.setInstructorProfileFileInfo(responseFileInfo);

            item.setInstructorId(s.getInstructorId());
            log.debug("해당 강사의 이름 조회 후 subscriptionInfo에 대입");
            item.setInstructorName(instructorRepository.findNameById(s.getInstructorId()));
            log.debug("해당 강사의 구독자 수 조회 후 subscriptionInfo에 대입");
            item.setSubscriberCount(subscriptionHistoryService.querySubscriberCount(s.getInstructorId()));

            subscribedInstructorItems.add(item);
        }
        return subscribedInstructorItems;
    }
}
