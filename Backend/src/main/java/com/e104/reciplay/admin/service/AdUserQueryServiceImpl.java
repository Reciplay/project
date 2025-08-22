package com.e104.reciplay.admin.service;

import com.e104.reciplay.admin.dto.response.AdUserDetail;
import com.e104.reciplay.admin.dto.response.AdUserSummary;
import com.e104.reciplay.user.security.domain.User;
import com.e104.reciplay.user.security.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdUserQueryServiceImpl implements  AdUserQueryService{
    private final UserRepository userRepository;
    @Override
    public List<AdUserSummary> queryUserSummaries() {
        List<User> users = userRepository.findAll();
        List<AdUserSummary> adUserSummaries = new ArrayList<>();
       log.debug("AdUserSummary애 user정보 설정");
        for(User user : users){
            AdUserSummary adUserSummary = new AdUserSummary(user);
            adUserSummaries.add(adUserSummary);
        }
        return adUserSummaries;
    }

    @Override
    public AdUserDetail queryUserDetail(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));
        log.debug("AdUserDetail에 user정보 설정");
        AdUserDetail adUserDetail = new AdUserDetail(user);
        return adUserDetail;
    }
}
