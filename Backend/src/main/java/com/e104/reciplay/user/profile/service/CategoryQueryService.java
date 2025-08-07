package com.e104.reciplay.user.profile.service;

import com.e104.reciplay.entity.Category;

import java.util.List;

public interface CategoryQueryService {
    Category queryCategoryById(Long id);
    List<Category> queryAllCategories();
}
