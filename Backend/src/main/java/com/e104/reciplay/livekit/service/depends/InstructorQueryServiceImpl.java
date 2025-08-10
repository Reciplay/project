package com.e104.reciplay.livekit.service.depends;

import com.e104.reciplay.course.courses.service.SubFileMetadataQueryService;
import com.e104.reciplay.entity.*;
import com.e104.reciplay.repository.InstructorRepository;
import com.e104.reciplay.s3.dto.response.ResponseFileInfo;
import com.e104.reciplay.s3.service.S3Service;
import com.e104.reciplay.user.instructor.dto.response.InstructorProfile;
import com.e104.reciplay.user.instructor.dto.response.InstructorStat;
import com.e104.reciplay.user.instructor.dto.response.item.CareerItem;
import com.e104.reciplay.user.instructor.dto.response.item.LicenseItem;
import com.e104.reciplay.user.instructor.dto.response.item.QnaDetail;
import com.e104.reciplay.user.instructor.service.*;
import com.e104.reciplay.user.security.domain.User;
import com.e104.reciplay.user.security.exception.EmailNotFoundException;
import com.e104.reciplay.user.security.service.UserQueryService;
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
    @Override
    public Instructor queryInstructorByEmail(String email) {
        User user = userQueryService.queryUserByEmail(email);
        return instructorRepository.findByUserId(user.getId()).orElseThrow(()->new IllegalArgumentException("강사가 아닌 유저의 이메일 입니다."));
    }

    @Override
    public Long queryInstructorIdByEmail(String email) {
        return instructorRepository.findIdByemail(email);
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
        FileMetadata instructorProfileMetadata = subFileMetadataQueryService.queryMetadataByCondition(instructorId, "user_profile");
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
        instructorProfile.setIsSubscribed(subscriptionQueryService.queryIsSubscription(userId, instructorId));
        instructorProfile.setSubscriberCount(subscriptionQueryService.countSubscriberByInstructorId(instructorId));
        instructorProfile.setName(instructorRepository.findNameById(instructorId));
        instructorProfile.setIntroduction(instructor.getIntroduction());

        return instructorProfile;
    }

    @Override
    public InstructorStat queryInstructorStatistic(Long instructorId) {
        InstructorStat instrutorStat = new InstructorStat();
        Integer totalStudents = instructorStatQueryService.queryTotalStudents(instructorId);
        Double averageStars = instructorStatQueryService.queryAvgStars(instructorId);
        Integer tatalReviewCount;
        Integer subscriberCount;
        String profileImageUrl;
        List<QnaDetail> newQuestions;

        return null;
    }
}
