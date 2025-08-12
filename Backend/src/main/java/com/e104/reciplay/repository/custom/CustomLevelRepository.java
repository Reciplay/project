package com.e104.reciplay.repository.custom;

import com.e104.reciplay.entity.Level;

import java.util.List;

public interface CustomLevelRepository {
    List<Level> findUserLevels(Long userId);
}
