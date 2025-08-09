package com.e104.reciplay.livekit.service.depends;

import com.e104.reciplay.entity.Instructor;
import com.e104.reciplay.repository.InstructorRepository;
import com.e104.reciplay.user.security.domain.User;
import com.e104.reciplay.user.security.service.UserQueryService;
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
        return instructorRepository.findByUserId(user.getId()).orElseThrow(()->new IllegalArgumentException("강사가 아닌 유저의 이메일 입니다."));
    }

    @Override
    public Long queryInstructorIdByEmail(String email) {
        return instructorRepository.findIdByemail(email);
    }

    @Override
    public String queryNameByInstructorId(Long instructorId) {
        return instructorRepository.findNameById(instructorId);
    }
}
