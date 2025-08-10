package com.e104.reciplay.user.instructor.repository;

import com.e104.reciplay.entity.Career;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CareerRepository extends JpaRepository<Career, Long> {
    void deleteAllById(Long instructorId);

    List<Career> findAllByInstrcutorId(Long instructorId);
}
