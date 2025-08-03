package com.e104_2.reciplaywebsocket.room.service.addtional;

import com.e104_2.reciplaywebsocket.room.repository.UserRepository;
import com.e104_2.reciplaywebsocket.security.domain.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserQueryServiceImpl implements UserQueryService{
    private final UserRepository userRepository;

    @Override
    public User queryUserByEmail(String email) {
        return userRepository.findByEmail(email).orElseThrow(() -> new IllegalArgumentException("해당 이메일은 등록되지 않았습니다."));
    }
}
