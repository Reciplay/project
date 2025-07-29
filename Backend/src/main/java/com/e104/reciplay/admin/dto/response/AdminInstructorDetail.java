package com.e104.reciplay.admin.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AdminInstructorDetail {
    private Long instructorId;
    private String name;
    private String email;
    private String registeredAt;
    private String nickName;
    private String birthDate;
    private Boolean role;
    private String createdAt;
    private String instroduction;
    private String address;
    private String phoneNumber;
    private List<License> licenses;
    private List<Career> careers;


}
