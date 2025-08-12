package com.e104.reciplay.user.profile.service;

import com.e104.reciplay.entity.Level;
import com.e104.reciplay.repository.LevelRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class LevelManagementServiceImpl implements LevelManagementService{
    private final LevelRepository levelRepository;

    @Override
    @Transactional
    public void increaseLevelOf(Long categoryId, Long userId, int amt) {
        Level level = levelRepository.findByCategoryIdAndUserId(categoryId, userId).orElseThrow(
                () -> new IllegalArgumentException("레벨 기록이 없습니다.")
        );
        level.setLevel(level.getLevel() + amt);
    }
}
