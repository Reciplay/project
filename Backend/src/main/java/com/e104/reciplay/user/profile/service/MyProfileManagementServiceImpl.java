package com.e104.reciplay.user.profile.service;

import com.e104.reciplay.entity.Category;
import com.e104.reciplay.entity.FileMetadata;
import com.e104.reciplay.entity.Level;
import com.e104.reciplay.repository.CategoryRepository;
import com.e104.reciplay.repository.LevelRepository;
import com.e104.reciplay.s3.enums.FileCategory;
import com.e104.reciplay.s3.enums.RelatedType;
import com.e104.reciplay.s3.exception.FileMetadataNotFoundException;
import com.e104.reciplay.s3.service.FileMetadataManagementService;
import com.e104.reciplay.s3.service.FileMetadataQueryService;
import com.e104.reciplay.s3.service.S3Service;
import com.e104.reciplay.user.profile.dto.request.ProfileInfoRequest;
import com.e104.reciplay.user.security.service.UserQueryService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import com.e104.reciplay.user.security.domain.User;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class MyProfileManagementServiceImpl implements MyProfileManagementService{
    private final UserQueryService userQueryService;
    private final FileMetadataManagementService fileMetadataManagementService;
    private final S3Service s3Service;
    private final FileMetadataQueryService fileMetadataQueryService;
    private final LevelRepository levelRepository;
    private final CategoryRepository categoryRepository;


    @Override
    @Transactional
    public void setupMyProfile(String email, ProfileInfoRequest request) {
        // 더티 체크를 통해 갱신.
        User user = userQueryService.queryUserByEmail(email);
        user.setName(request.getName());
        user.setGender(request.getGender());
        user.setBirthDate(request.getBirthDate());
        user.setJob(request.getJob());

        List<Category> categoryList = categoryRepository.findAll();
        for(Category category : categoryList) {
            levelRepository.save(new Level(null, user.getId(), category.getId(), 0));
        }
    }

    @Override
    @Transactional
    public void updateProfileImage(MultipartFile image, String userEmail) {
        User user = userQueryService.queryUserByEmail(userEmail);
        try {
            FileMetadata oldFile = fileMetadataQueryService.queryUserProfilePhoto(user.getId());
            s3Service.deleteFile(oldFile);
        } catch(FileMetadataNotFoundException e) {
            log.debug("새로운 프로필 이미지 업데이트.");
        }

        try {
            s3Service.uploadFile(image, FileCategory.IMAGES, RelatedType.USER_PROFILE, user.getId(), 1);
        } catch (IOException e) {
            log.warn("S3 업로드 과정에서 문제가 발생했습니다. : {}", e.getMessage());
        }
    }
}
