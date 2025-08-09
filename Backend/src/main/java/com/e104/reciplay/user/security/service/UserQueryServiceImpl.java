package com.e104.reciplay.user.security.service;

import com.e104.reciplay.user.security.domain.User;
import com.e104.reciplay.user.security.exception.EmailNotFoundException;
import com.e104.reciplay.user.security.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserQueryServiceImpl implements UserQueryService{
    private final UserRepository userRepository;

    @Override
    public User queryUserByEmail(String email) {
        return userRepository.findByEmail(email).orElseThrow(()->new EmailNotFoundException("전달된 이메일을 찾을 수 없습니다. (이메일 : "+email+")"));
    }

    @Override
    public Boolean isDuplicatedEmail(String email) {
        User user = null;
        try {
            user = this.queryUserByEmail(email);
        } catch(Exception e) {
            log.debug("사용 가능 이메일 {}", email);
        }
        return user != null;
    }

    @Override
    public User queryUserByNickname(String nickname) {
        return userRepository.findByNickname(nickname).orElseThrow(() -> new IllegalArgumentException("해당하는 닉네임이 존재하지 않습니다."));
    }

    @Override
    public Boolean isDuplicatedNickname(String nickname) {
        try {
            this.queryUserByNickname(nickname);
            return true;
        } catch (IllegalArgumentException e) {
            log.debug("사용 가능 닉네임");
            return false;
        }

    }

    @Override
    public List<String> queryEmailsByNameAndBirthDay(String name, LocalDate birthDay) {
        return userRepository.findByNameAndBirthDate(name, birthDay).stream().map(User::getEmail).toList();
    }

}
