package com.e104.reciplay.user.profile.service;

import com.e104.reciplay.common.types.FoodCategory;

public interface LevelManagementService {
    void increaseLevelOf(Long categoryId, Long userId, int amt);
}
