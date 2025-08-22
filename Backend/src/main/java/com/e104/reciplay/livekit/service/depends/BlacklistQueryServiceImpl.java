package com.e104.reciplay.livekit.service.depends;

import com.e104.reciplay.repository.BlacklistReposiroty;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class BlacklistQueryServiceImpl implements BlacklistQueryService{
    private final BlacklistReposiroty blacklistReposiroty;

    @Override
    public boolean isInBlacklistOf(Long userId, Long courseId) {
        return blacklistReposiroty.existsByUserIdAndCourseId(userId, courseId);
    }
}
