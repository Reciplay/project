package com.e104.reciplay.repository;

import com.e104.reciplay.entity.Level;
import com.e104.reciplay.repository.custom.CustomLevelRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LevelRepository extends JpaRepository<Level, Long>, CustomLevelRepository {
}
