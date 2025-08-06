package com.e104.reciplay.user.profile.service;

import com.e104.reciplay.user.profile.dto.request.ProfileInfoRequest;

public interface MyProfileManagementService {
    void setupMyProfile(String email, ProfileInfoRequest request);
}
