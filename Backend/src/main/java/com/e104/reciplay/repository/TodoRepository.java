package com.e104.reciplay.repository;

import com.e104.reciplay.entity.Todo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TodoRepository extends JpaRepository<Todo, Long> {
    void deleteByChapterId(Long chapterId);
    List<Todo> findByChapterId(Long chapterId);
}
