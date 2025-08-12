package com.e104.reciplay.admin.service;

import com.e104.reciplay.user.security.domain.User;
import com.e104.reciplay.user.security.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdUserManagementServiceImpl implements AdUserManagementService {
    private final UserRepository userRepository;
    @Override
    public void updateUserRoleToInstructor(Long userId) {
        userRepository.updateUserRoleToInstructorById(userId);
    }

    @Override
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(()-> new EntityNotFoundException("존재하지 않는 유저 입니다."));
        user.setIsActivated(false);
        userRepository.save(user);
        //
        // 추가 삭제 내용 추가 필요
        //
    }
}
