package com.e104.reciplay.user.profile.service;

import com.e104.reciplay.user.profile.dto.response.ProfileInformation;
import com.e104.reciplay.user.profile.dto.response.item.LevelSummary;

import java.util.List;

public interface MyProfileQueryService {
    ProfileInformation queryProfileInformation(String email);
    List<LevelSummary> queryMyLevels(String email);
}
