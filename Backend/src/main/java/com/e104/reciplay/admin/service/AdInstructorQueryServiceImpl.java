package com.e104.reciplay.admin.service;

import com.e104.reciplay.admin.dto.response.AdCareerinfo;
import com.e104.reciplay.admin.dto.response.AdInstructorDetail;
import com.e104.reciplay.admin.dto.response.AdInstructorSummary;
import com.e104.reciplay.admin.dto.response.AdLicenseInfo;
import com.e104.reciplay.entity.Career;
import com.e104.reciplay.entity.InstructorLicense;
import com.e104.reciplay.repository.InstructorRepository;
import com.e104.reciplay.user.instructor.service.CareerQueryService;
import com.e104.reciplay.user.instructor.service.InstructorLicenseQueryService;
import com.e104.reciplay.user.instructor.service.LicenseQueryService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdInstructorQueryServiceImpl implements AdInstructorQueryService{
    private final InstructorRepository instructorRepository;
    private final InstructorLicenseQueryService instructorLicenseQueryService;
    private final CareerQueryService careerQueryService;
    private final LicenseQueryService licenseQueryService;
    @Override
    public List<AdInstructorSummary> queryAdInstructorSummary(Boolean isApprove) {
        if (isApprove == null) {
            throw new IllegalArgumentException("승인 여부 값(isApprove)이 필요합니다.");
        }
        return instructorRepository.findAdInstructorSummariesByIsApprove(isApprove);
    }

    @Override
    public AdInstructorDetail queryInstructorDetail(Long instructorId) {
        AdInstructorDetail detail = instructorRepository.findAdInstructorDetailByInstructorId(instructorId);
        if(detail == null){
            throw new EntityNotFoundException("존재하지 않는 강사입니다.");
        }

        List<InstructorLicense> licenses = instructorLicenseQueryService.queryLicensesByInstructorId(instructorId);
        List<AdLicenseInfo> adLicenseInfos = new ArrayList<>();
        for(InstructorLicense license : licenses){
            AdLicenseInfo adLicenseInfo = new AdLicenseInfo(license);
            adLicenseInfo.setName(licenseQueryService.queryLicenseById(license.getLicenseId()).getName());
            adLicenseInfos.add(adLicenseInfo);
        }

        List<Career> careers = careerQueryService.queryCarrersByInstructorId(instructorId);
        List<AdCareerinfo> adCareerinfos = new ArrayList<>();
        for(Career c : careers){
            AdCareerinfo adCareerinfo = new AdCareerinfo(c);
            adCareerinfos.add(adCareerinfo);
        }
        detail.setLicenses(adLicenseInfos);
        detail.setCareers(adCareerinfos);

        return detail;
    }
}
