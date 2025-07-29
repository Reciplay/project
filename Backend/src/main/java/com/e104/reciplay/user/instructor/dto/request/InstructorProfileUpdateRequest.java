package com.e104.reciplay.user.instructor.dto.request;

import com.e104.reciplay.user.instructor.dto.response.item.CareerItem;
import com.e104.reciplay.user.instructor.dto.response.item.LicenseItem;

import java.util.List;

public class InstructorProfileUpdateRequest {
    private String introduction; // 소개말
    private List<LicenseItem> licenses;
    private List<CareerItem> careers;
}
