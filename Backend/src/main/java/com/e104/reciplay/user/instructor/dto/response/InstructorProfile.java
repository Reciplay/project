package com.e104.reciplay.user.instructor.dto.response;

import com.e104.reciplay.s3.dto.response.ResponseFileInfo;
import com.e104.reciplay.user.instructor.dto.response.item.CareerItem;
import com.e104.reciplay.user.instructor.dto.response.item.LicenseItem;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InstructorProfile {
    private String name; // 강사명
    private ResponseFileInfo instructorProfileFileInfo;
    private ResponseFileInfo instructorBannerFileInfo;
    private String introduction; // 소개발
    private List<LicenseItem> licenses;
    private List<CareerItem> careers;
    private Integer subscriberCount;
    private Boolean isSubscribed;
}
