package com.e104.reciplay.repository;

import com.e104.reciplay.entity.Category;
import com.e104.reciplay.repository.custom.CustomCategoryRepository;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long>, CustomCategoryRepository {
}
