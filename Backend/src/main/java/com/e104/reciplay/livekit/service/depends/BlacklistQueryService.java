package com.e104.reciplay.livekit.service.depends;

public interface BlacklistQueryService {
    boolean isInBlacklistOf(Long userId, Long courseId);
}
