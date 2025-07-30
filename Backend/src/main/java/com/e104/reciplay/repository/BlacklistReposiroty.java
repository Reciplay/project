package com.e104.reciplay.repository;

import com.e104.reciplay.entity.Blacklist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BlacklistReposiroty extends JpaRepository<Blacklist, Long> {
    boolean existsByUserIdAndCourseId(Long userId, Long courseId);
}
