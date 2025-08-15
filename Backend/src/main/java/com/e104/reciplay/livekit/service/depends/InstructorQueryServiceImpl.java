package com.e104.reciplay.livekit.service.depends;

import com.e104.reciplay.course.courses.service.SubFileMetadataQueryService;
import com.e104.reciplay.course.qna.service.QnaQueryService;
import com.e104.reciplay.entity.*;
import com.e104.reciplay.repository.InstructorRepository;
import com.e104.reciplay.s3.dto.response.ResponseFileInfo;
import com.e104.reciplay.s3.service.S3Service;
import com.e104.reciplay.user.instructor.dto.response.InstructorProfile;
import com.e104.reciplay.user.instructor.dto.response.InstructorStat;
import com.e104.reciplay.user.instructor.dto.response.TrendPoint;
import com.e104.reciplay.user.instructor.dto.response.TrendResponse;
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
import com.e104.reciplay.user.subscription.service.SubscriptionHistoryQueryService;
import com.e104.reciplay.user.subscription.service.SubscriptionQueryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class InstructorQueryServiceImpl implements InstructorQueryService {
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
    private final SubscriptionHistoryQueryService subscriptionHistoryService;
    private static final String USER_PROFILE = "USER_PROFILE";
    private static final String INSTRUCTOR_BANNER = "INSTRUCTOR_BANNER";

    @Override
    public Instructor queryInstructorByEmail(String email) {
        log.debug("강사를 이메일로 조회하는 메서드 email = {}", email);
        User user = userQueryService.queryUserByEmail(email);
        return instructorRepository.findByUserId(user.getId()).orElseThrow(() -> new IllegalArgumentException("강사가 아닌 유저의 이메일 입니다."));
    }

    @Override
    public Long queryInstructorIdByEmail(String email) {
        log.debug("강사 아이디 이메일로 조회하는 메서드 email = {}", email);
        return instructorRepository.findIdByEmail(email);
    }

    @Override
    public String queryNameByInstructorId(Long instructorId) {
        log.debug("강사 아이디로 이름을 조회하는 메서드 instructorId = {}", instructorId);
        return instructorRepository.findNameById(instructorId);
    }

    @Override
    public Instructor queryInstructorById(Long instructorId) {
        log.debug("강사 아이디로 강사를 조회하는 메서드 instructorId = {}", instructorId);
        return instructorRepository.findById(instructorId).orElseThrow(() -> new EmailNotFoundException("전달된 instructorId를 찾을 수 없습니다. (instructorId : " + instructorId + ")"));
    }

    @Override
    public InstructorProfile queryInstructorProfile(Long instructorId, Long userId) {
        log.debug("강사 아이디로 강사 프로필 조회하는 메서드 instructorId = {}, userId = {}", instructorId, userId);
        Instructor instructor = instructorRepository.findById(instructorId).orElseThrow(() -> new EmailNotFoundException("전달된 강사을 찾을 수 없습니다. (강사Id : " + instructorId + ")"));
        log.debug("조회된 강사 = {}", instructor);

        // InstructorProfile 인스턴스 생성
        InstructorProfile instructorProfile = new InstructorProfile();
        log.debug("조회된 강사 프로필 = {}", instructorProfile);

        // 강사 프로필 이미지 찾기
        ResponseFileInfo instructorProfileFileInfo = null;
        try {
            FileMetadata instructorProfileMetadata = subFileMetadataQueryService.queryMetadataByCondition(instructor.getUserId(), USER_PROFILE);
            log.debug("조회된 강사 프로필의 메타 데이터 = {}", instructorProfileMetadata);

            instructorProfileFileInfo = s3Service.getResponseFileInfo(instructorProfileMetadata);
            log.debug("조회된 강사 프로필 파일의 정보 = {}", instructorProfileFileInfo);
        } catch (Exception e) {
            log.debug("이미지 조회중 에러가 발생함. {}", e.getMessage());
        }

        ResponseFileInfo instructorBannerFileInfo = null;
        // 강사 배너 이미지 찾기
        try {
            FileMetadata instructorBannerMetadata = subFileMetadataQueryService.queryMetadataByCondition(instructorId, INSTRUCTOR_BANNER);
            log.debug("조회된 강사 배너 파일 정보 = {}", instructorProfileFileInfo);

            instructorBannerFileInfo = s3Service.getResponseFileInfo(instructorBannerMetadata);
            log.debug("조회된 강사 배너 파일 = {}", instructorBannerFileInfo);

        } catch (Exception e) {
            log.debug("파일 조회 예외 {}", e.getMessage());
            log.debug("이미지 파일이 없는 것 같습니다.");
        }
        log.debug("licenseItemIist 설정");
        // licenseItemList 설정
        List<LicenseItem> licenseItems = new ArrayList<>();
        List<InstructorLicense> licenses = instructorLicenseQueryService.queryLicensesByInstructorId(instructorId);
        for (InstructorLicense license : licenses) {
            LicenseItem item = new LicenseItem(license);
            item.setLicenseName(licenseQueryService.queryLicenseById(license.getLicenseId()).getName());
            licenseItems.add(item);
        }

        log.debug("careerItemIist 설정");
        // careerItemList 설정
        List<CareerItem> careerItems = new ArrayList<>();
        List<Career> careers = careerQueryService.queryCarrersByInstructorId(instructorId);
        for (Career career : careers) {
            CareerItem item = new CareerItem(career);
            careerItems.add(item);
        }


        // instructorProfile 값 설정
        log.debug("instructorProfileFileInfo 설정");
        instructorProfile.setInstructorProfileFileInfo(instructorProfileFileInfo);
        log.debug("instructorBannerFileInfo 설정");
        instructorProfile.setInstructorBannerFileInfo(instructorBannerFileInfo);
        log.debug("careerItems 설정");
        instructorProfile.setCareers(careerItems);
        log.debug("licneseItems 설정");
        instructorProfile.setLicenses(licenseItems);
        log.debug("licneseItems 설정");
        instructorProfile.setIsSubscribed(subscriptionQueryService.isSubscribedInstructor(instructorId, userId));
        log.debug("해당 유저 구독했는지 변수 설정");
        instructorProfile.setSubscriberCount(subscriptionQueryService.countSubscribers(instructorId).intValue());
        log.debug("해당 유저 구독했는지 변수 설정");
        instructorProfile.setName(instructorRepository.findNameById(instructorId));
        log.debug("강사 소개 변수 설정");
        instructorProfile.setIntroduction(instructor.getIntroduction());

        return instructorProfile;
    }

    @Override
    public InstructorStat queryInstructorStatistic(Long instructorId) {
        log.debug("강사 통계 정보 조회 메서드 실행.");
        InstructorStat instructorStat = new InstructorStat();
        Integer totalStudents = instructorStatQueryService.queryTotalStudents(instructorId);
        log.debug("총 학생 수 : {} 명", totalStudents);
        Double averageStars = instructorStatQueryService.queryAvgStars(instructorId);
        log.debug("평균 별점 : {} 점", averageStars);
        Integer totalReviewCount = instructorStatQueryService.queryTotalReviewCount(instructorId);
        log.debug("총 리뷰 수 : {} 개", totalReviewCount);
        Integer subscriberCount = instructorStatQueryService.querySubsciberCount(instructorId);
        log.debug("총 구독자 수 : {} 명", subscriberCount);

        ResponseFileInfo instructorProfileFileInfo = null;
        Instructor instructor = this.queryInstructorById(instructorId);
        try {
            FileMetadata profileMetadata = subFileMetadataQueryService.queryMetadataByCondition(instructor.getUserId(), USER_PROFILE);
            instructorProfileFileInfo = s3Service.getResponseFileInfo(profileMetadata);
        } catch (RuntimeException e) {
            log.debug("프로필 조회중 오류 발생함. : {}", e.getMessage());
        }

        log.debug("questions 조회");
        List<InstructorQuestion> newQuestions = qnaQueryService.queryQuestionsByInstructorId(instructorId);
        log.debug("instructorStat 변수들 설정");
        instructorStat.setAverageStars(averageStars);
        instructorStat.setSubscriberCount(subscriberCount);
        instructorStat.setTotalReviewCount(totalReviewCount);
        instructorStat.setNewQuestions(newQuestions);
        instructorStat.setProfileFileInfo(instructorProfileFileInfo);
        instructorStat.setTotalStudents(totalStudents);
        return instructorStat;
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

        for (Subscription s : subscriptions) {
            SubscribedInstructorItem item = new SubscribedInstructorItem();

            log.debug("해당 강사의 사용자 아이디 조회");
            Long instructorUserId = instructorRepository.findById(s.getInstructorId()).get().getUserId();
            ResponseFileInfo responseFileInfo = null;
            try {
                log.debug("해당 강사의 userProfileFileMetadata 조회");
                FileMetadata fileMetadata = subFileMetadataQueryService.queryMetadataByCondition(instructorUserId, USER_PROFILE);
                log.debug("해당 강사의 responseFIleInfo 생성");
                responseFileInfo = s3Service.getResponseFileInfo(fileMetadata);
            }catch(RuntimeException e){
                log.debug("프로필 조회중 오류 발생함. : {}", e.getMessage());
            }
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

    @Override
    public Boolean existsByUserId(Long userId) {
        return instructorRepository.existsByUserId(userId);
    }

    @Override
    public TrendResponse querySubscriberTrends(String criteria, Long instructorId) {
        LocalDate today = LocalDate.now();
        List<LocalDate> targetDates = new ArrayList<>();
        LocalDate from = null;

        log.debug("criteria 별로 from 설정 및 targetDates 설정");
        switch (criteria) {
            case "day" -> {
                from = today.minusMonths(1);
                for (LocalDate d = from; !d.isAfter(today); d = d.plusDays(1)) {
                    targetDates.add(d);
                }
                log.debug("day의 from 설정 및 targetDates 설정 완료");
            }
            case "week" -> {
                from = today.minusMonths(3);
                LocalDate weekPointer = from.with(DayOfWeek.MONDAY);
                while (!weekPointer.isAfter(today)) {
                    targetDates.add(weekPointer);
                    weekPointer = weekPointer.plusWeeks(1);
                }
                log.debug("week의 from 설정 및 targetDates 설정 완료");
            }
            case "month" -> {
                from = today.minusYears(1).withDayOfMonth(1);
                LocalDate monthPointer = from;
                while (!monthPointer.isAfter(today)) {
                    targetDates.add(monthPointer);
                    monthPointer = monthPointer.plusMonths(1);
                }
                log.debug("month의 from 설정 및 targetDates 설정 완료");
            }
            default -> throw new IllegalArgumentException("Invalid criteria: " + criteria);
        }
        log.debug("TrendPoint 리스트 생성");
        List<TrendPoint> series = subscriptionHistoryService.queryTrendPoints(instructorId, targetDates);

        log.debug("TrendResponse 생성");
        return new TrendResponse(criteria, from, today, series);
    }


}
