package com.e104.reciplay.user.profile.service;

import com.e104.reciplay.common.types.FoodCategory;
import com.e104.reciplay.entity.FileMetadata;
import com.e104.reciplay.entity.Level;
import com.e104.reciplay.s3.dto.response.ResponseFileInfo;
import com.e104.reciplay.s3.exception.FileMetadataNotFoundException;
import com.e104.reciplay.s3.service.FileMetadataQueryService;
import com.e104.reciplay.s3.service.S3Service;
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
    private final FileMetadataQueryService fileMetadataQueryService;
    private final S3Service s3Service;

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
        try {
            // 이미지 url을 기록.
            FileMetadata metadata = fileMetadataQueryService.queryUserProfilePhoto(user.getId());
            ResponseFileInfo profileImage = s3Service.getResponseFileInfo(metadata);
            profile.setProfileImage(profileImage);
        } catch (FileMetadataNotFoundException e) {
            log.debug("프로필 이미지가 없습니다.");
        }
        return profile;
    }
}
