package com.e104.reciplay.user.instructor.service;

import com.e104.reciplay.entity.Career;
import com.e104.reciplay.entity.Instructor;
import com.e104.reciplay.entity.InstructorLicense;
import com.e104.reciplay.livekit.service.depends.InstructorQueryService;
import com.e104.reciplay.repository.InstructorRepository;
import com.e104.reciplay.s3.enums.FileCategory;
import com.e104.reciplay.s3.enums.RelatedType;
import com.e104.reciplay.s3.service.S3Service;
import com.e104.reciplay.user.instructor.dto.request.InstructorApplicationRequest;
import com.e104.reciplay.user.instructor.dto.request.InstructorProfileUpdateRequest;
import com.e104.reciplay.user.instructor.dto.response.item.CareerItem;
import com.e104.reciplay.user.instructor.dto.response.item.LicenseItem;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RequiredArgsConstructor
@Service
@Slf4j
public class InstructorManagementServiceImpl implements InstructorManagementService{
    private final S3Service s3Service;
    private final InstructorRepository instructorRepository;
    private final InstructorLicenseManagementService instructorLicenseManagementService;
    private final CareerManagementService careerManagementService;
    private final LicenseQueryService licenseQueryService;
    private final InstructorQueryService instructorQueryService;

    @Override
    @Transactional
    public void registerInstructor(Long userId, InstructorApplicationRequest request, MultipartFile instructorBannerImage) {
        Instructor instructor = new Instructor(request, userId);
        log.debug("입력하게 될 강사 엔티티 {}", instructor);
        instructorRepository.save(instructor);
        createCommonInstructorInfo(instructor.getId(), instructorBannerImage,request.getCareers(),request.getLicenses());
    }

    @Override
    public void updateInstructor(Long instructorId, InstructorProfileUpdateRequest request, MultipartFile instructorBannerImage) {
        Instructor instructor = instructorQueryService.queryInstructorById(instructorId);
        instructor.setIntroduction(instructor.getIntroduction());
        // 기존 강사 배너 이미지, 경력, 자격증 모두 삭제
        s3Service.deleteFile(FileCategory.IMAGES,RelatedType.INSTRUCTOR_BANNER,instructorId,1);
        instructorLicenseManagementService.deleteInstrutorLicensesByInstructorId(instructorId);
        careerManagementService.deleteCareersByInstructorId(instructorId);
        // 공통 강사 정보 생성( 강사 배너 이미지, 경력, 자격증 모두)
        createCommonInstructorInfo(instructorId, instructorBannerImage,request.getCareers(),request.getLicenses());

    }

    // 공통 강사 정보 생성( 강사 배너 이미지, 경력, 자격증 모두)
    private void createCommonInstructorInfo(Long instructorId, MultipartFile instructorBannerImage, List<CareerItem> careerItems, List<LicenseItem> licenseItems){
        try {
            s3Service.uploadFile(instructorBannerImage, FileCategory.IMAGES, RelatedType.INSTRUCTOR_BANNER, instructorId, 1);
        } catch (IOException e) {
            log.warn("S3 업로드 과정에서 문제가 발생했습니다. : {}", e.getMessage());
        }

        log.debug("자격증 목록 {}", licenseItems);
        for(LicenseItem license : licenseItems){
            if(license.getLicenseId() == null || licenseQueryService.queryLicenseById(license.getLicenseId()) == null ){
                log.debug("자격증 정보에서 이상이 있습니다. 해당 자격증 등록은 무시됩니다. {}", license);
                continue; // 다음 for문 진행
            }
            InstructorLicense instructorLicense = new InstructorLicense(license, instructorId);
            instructorLicenseManagementService.saveInstructorLicense(instructorLicense);
        }

        log.debug("경력 목록 {}", careerItems);
        for(CareerItem item : careerItems){
            // companyName이 비어있거나 null인 경우 예외 처리 후 다음 반복
            if (item.getCompanyName() == null || item.getCompanyName().trim().isEmpty()) {
                // 로그 남기기
                log.warn("경력 정보에서 companyName이 없습니다. 해당 경력 등록은 무시됩니다. {}", item);
                continue; // 다음 for문 진행
            }
            Career career = new Career(item, instructorId);
            careerManagementService.saveCareer(career);

        }
    }

}
