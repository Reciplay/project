package com.e104.reciplay.user.profile.service;

import com.e104.reciplay.user.profile.dto.ProfileInfoRequest;
import com.e104.reciplay.user.security.service.UserQueryService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import com.e104.reciplay.user.security.domain.User;

@Service
@RequiredArgsConstructor
@Slf4j
public class MyProfileManagementServiceImpl implements MyProfileManagementService{
    private final UserQueryService userQueryService;

    @Override
    @Transactional
    public void setupMyProfile(String email, ProfileInfoRequest request) {
        // 더티 체크를 통해 갱신.
        User user = userQueryService.queryUserByEmail(email);
        user.setName(request.getName());
        user.setGender(request.getGender());
        user.setBirthDate(request.getBirthDate());
        user.setJob(request.getJob());
    }
}
