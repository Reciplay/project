package com.e104_2.reciplaywebsocket.room.service.addtional;

import com.e104_2.reciplaywebsocket.entity.Instructor;
import com.e104_2.reciplaywebsocket.room.repository.InstructorRepository;
import com.e104_2.reciplaywebsocket.security.domain.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class InstructorQueryServiceImpl implements InstructorQueryService{
    private final UserQueryService userQueryService;
    private final InstructorRepository instructorRepository;
    @Override
    public Instructor queryInstructorByEmail(String email) {
        User user = userQueryService.queryUserByEmail(email);
        return instructorRepository.findByUserId(user.getId()).orElseThrow(() -> new IllegalArgumentException("강사가 아닌 회원입니다."));
    }

    @Override
    public Instructor queryInstructorById(Long instructorId) {
        return instructorRepository.findById(instructorId).orElseThrow(() -> new IllegalArgumentException("존재하지 않는 강사 입니다."));
    }
}
