package com.e104.reciplay.user.profile.service;

import com.e104.reciplay.entity.Category;
import com.e104.reciplay.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryQueryServiceImpl implements CategoryQueryService{
    private final CategoryRepository categoryRepository;

    @Override
    public Category queryCategoryById(Long id) {
        return categoryRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("지정된 카테고리는 존재하지 않습니다."));
    }

    @Override
    public List<Category> queryAllCategories() {
        return categoryRepository.findAll();
    }

    @Override
    public String queryNameByCourseId(Long courseId) {
        return categoryRepository.findNameByCourseId(courseId);
    }

}
