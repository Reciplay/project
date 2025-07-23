package com.e104.reciplay.myprofile.service;

import com.e104.reciplay.common.types.FoodCategory;
import com.e104.reciplay.myprofile.dto.ProfileInfoRequest;
import com.e104.reciplay.myprofile.dto.ProfileInformation;
import com.e104.reciplay.security.exception.EmailNotFoundException;
import com.e104.reciplay.security.repository.UserRepository;
import com.e104.reciplay.security.util.AuthenticationUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class MyProfileQueryServiceImpl implements MyProfileQueryService{
    private final UserRepository userRepository;

    @Override
    public ProfileInformation queryProfileInformation() {
        String email = AuthenticationUtil.getSessionUsername();
        ProfileInformation profile = new ProfileInformation(userRepository.findByEmail(email).orElseThrow(() -> new EmailNotFoundException("해당하는 유저의 이메일이 없습니다. (아이디 : "+email+")")));
        // 역량 넣기
        profile.setLevels(Map.of(FoodCategory.KOREAN, 0, FoodCategory.CHAINESE, 0, FoodCategory.JAPANESE, 0, FoodCategory.DESSERT, 0 , FoodCategory.ETC, 0));
        return profile;
    }
}
