package com.e104.reciplay.user.instructor.repository;

import com.e104.reciplay.entity.InstructorLicense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InstructorLicenseRepository extends JpaRepository<InstructorLicense, Long> {
    void deleteAllByInstructorId(Long instructorId);
    List<InstructorLicense> findAllByIdInstrcutorId(Long instructorId);
}
