package com.e104.reciplay.admin.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AdInstructorDetail {
    private Long instructorId;
    private String name;
    private String email;
    private LocalDateTime registeredAt;
    private String nickName;
    private LocalDate birthDate;
    private LocalDateTime createdAt;
    private String introduction;
    private String address;
    private String phoneNumber;
    private List<AdLicenseInfo> licenses;
    private List<AdCareerinfo> careers;

}
