package com.e104.reciplay.user.security.service;

import com.e104.reciplay.user.security.domain.User;
import com.e104.reciplay.user.security.exception.EmailNotFoundException;
import com.e104.reciplay.user.security.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserQueryServiceImpl implements UserQueryService{
    private final UserRepository userRepository;

    @Override
    public User queryUserByEmail(String email) {
        return userRepository.findByEmail(email).orElseThrow(()->new EmailNotFoundException("전달된 이메일을 찾을 수 없습니다. (이메일 : "+email+")"));
    }
}
