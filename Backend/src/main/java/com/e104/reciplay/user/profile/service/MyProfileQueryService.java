package com.e104.reciplay.user.profile.service;

import com.e104.reciplay.user.profile.dto.response.ProfileInformation;

public interface MyProfileQueryService {
    ProfileInformation queryProfileInformation(String email);
}
