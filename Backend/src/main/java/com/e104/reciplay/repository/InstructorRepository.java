package com.e104.reciplay.repository;

import com.e104.reciplay.entity.Instructor;
import com.e104.reciplay.repository.custom.CustomInstructorRepository;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


public interface InstructorRepository extends JpaRepository<Instructor, Long>, CustomInstructorRepository {
    Optional<Instructor> findByUserId(Long userId);

    boolean existsByUserId(Long userId);

}
