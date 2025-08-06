package com.e104.reciplay.user.profile.service;

import com.e104.reciplay.common.types.FoodCategory;
import com.e104.reciplay.entity.Level;
import com.e104.reciplay.user.profile.dto.response.ProfileInformation;
import com.e104.reciplay.user.profile.dto.response.item.LevelSummary;
import com.e104.reciplay.user.security.domain.User;
import com.e104.reciplay.user.security.service.UserQueryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class MyProfileQueryServiceImpl implements MyProfileQueryService{
    private final UserQueryService userQueryService;
    private final LevelQueryService levelQueryService;
    private final CategoryQueryService categoryQueryService;

    @Override
    public ProfileInformation queryProfileInformation(String email) {
        User user = userQueryService.queryUserByEmail(email);
        ProfileInformation profile = new ProfileInformation(user);

        // 역량 넣기
        List<Level> levels = levelQueryService.queryUserLevelsById(user.getId());
        List<LevelSummary> levelSummaries = levels.stream().map(l -> {
            LevelSummary summary = new LevelSummary();
            summary.setCategoryId(l.getCategoryId());
            summary.setCategory(categoryQueryService.queryCategoryById(l.getCategoryId()).getName());
            summary.setLevel(l.getLevel());
            return summary;
        }).toList();

        profile.setLevels(levelSummaries);

        return profile;
    }
}
