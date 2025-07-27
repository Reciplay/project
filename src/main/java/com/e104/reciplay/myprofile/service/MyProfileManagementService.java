package com.e104.reciplay.myprofile.service;

import com.e104.reciplay.myprofile.dto.ProfileInfoRequest;

public interface MyProfileManagementService {
    void setupMyProfile(String email, ProfileInfoRequest request);
}
