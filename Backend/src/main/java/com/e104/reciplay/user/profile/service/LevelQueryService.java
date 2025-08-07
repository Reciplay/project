package com.e104.reciplay.user.profile.service;

import com.e104.reciplay.entity.Level;

import java.util.List;

public interface LevelQueryService {
    List<Level> queryUserLevelsById(Long userId);
}
