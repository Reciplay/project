package com.e104.reciplay.user.profile.service;

import com.e104.reciplay.user.profile.dto.request.ProfileInfoRequest;
import org.springframework.web.multipart.MultipartFile;
import retrofit2.http.Multipart;

import java.io.IOException;

public interface MyProfileManagementService {
    void setupMyProfile(String email, ProfileInfoRequest request);
    void updateProfileImage(MultipartFile image, String userEmail);
}
