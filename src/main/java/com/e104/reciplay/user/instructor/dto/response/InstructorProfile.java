package com.e104.reciplay.user.instructor.dto.response;

import com.e104.reciplay.user.instructor.dto.response.item.CareerItem;
import com.e104.reciplay.user.instructor.dto.response.item.LicenseItem;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import software.amazon.awssdk.services.s3.endpoints.internal.Value;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InstructorProfile {
    private String name; // 강사명 
    private String profileImage; // 프로필 이미지 url
    private String coverImage; // 커버 이미지 url
    private String introduction; // 소개발
    private List<LicenseItem> licenses;
    private List<CareerItem> careers;
    private Integer subscriberCount;
    private Boolean isSubscribed;
}
