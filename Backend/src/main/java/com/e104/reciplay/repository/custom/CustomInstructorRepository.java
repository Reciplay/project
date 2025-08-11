package com.e104.reciplay.repository.custom;

public interface CustomInstructorRepository {
    Long findIdByEmail(String email);

    String findNameById(Long id);
}
