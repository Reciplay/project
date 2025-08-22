package com.e104.reciplay.user.profile.service;

import com.e104.reciplay.entity.Level;
import com.e104.reciplay.repository.LevelRepository;
import com.e104.reciplay.user.security.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor

public class LevelQueryServiceImpl implements LevelQueryService{
    private final LevelRepository levelRepository;

    @Override
    public List<Level> queryUserLevelsById(Long userId) {
        return levelRepository.findUserLevels(userId);
    }
}
