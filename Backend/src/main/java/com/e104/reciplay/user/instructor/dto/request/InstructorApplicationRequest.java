package com.e104.reciplay.user.instructor.dto.request;

import com.e104.reciplay.user.instructor.dto.response.item.CareerItem;
import com.e104.reciplay.user.instructor.dto.response.item.LicenseItem;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class InstructorApplicationRequest {
    private String address;
    private String phoneNumber;
    private String introduction;
    private List<LicenseItem> licenses;
    private List<CareerItem> careers;
}
