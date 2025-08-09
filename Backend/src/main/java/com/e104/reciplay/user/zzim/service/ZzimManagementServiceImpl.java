package com.e104.reciplay.user.zzim.service;

import com.e104.reciplay.course.courses.repository.ZzimRepository;
import com.e104.reciplay.course.courses.service.ZzimQueryService;
import com.e104.reciplay.entity.Zzim;
import com.e104.reciplay.user.security.domain.User;
import com.e104.reciplay.user.security.service.UserQueryService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class ZzimManagementServiceImpl implements ZzimManagementService{
    private final ZzimRepository zzimRepository;
    private final ZzimQueryService zzimQueryService;
    private final UserQueryService userQueryService;

    @Override
    @Transactional
    public void zzimCourse(Long courseId, String email) {
        User user = userQueryService.queryUserByEmail(email);

        if(zzimQueryService.isZzimed(courseId, user.getId())) {
            throw new IllegalArgumentException("이미 찜한 강좌는 찜할 수 없습니다.");
        }

        zzimRepository.save(new Zzim(null, user.getId(), courseId));
    }

    @Override
    @Transactional
    public void unzzimCourse(Long courseId, String email) {
        User user = userQueryService.queryUserByEmail(email);

        if(!zzimQueryService.isZzimed(courseId, user.getId())) {
            throw new IllegalArgumentException("찜하지 않은 강좌는 찜을 취소할 수 없습니다.");
        }
        Zzim zzim = zzimRepository.findByCourseIdAndUserId(courseId, user.getId()).orElseThrow(() -> new IllegalArgumentException("찜한 이력이 없습니다."));
        zzimRepository.delete(zzim);
    }
}
