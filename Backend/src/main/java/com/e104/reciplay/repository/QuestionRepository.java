package com.e104.reciplay.repository;

import com.e104.reciplay.entity.Question;
import com.e104.reciplay.repository.custom.CustomQuestionRepository;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Long>, CustomQuestionRepository {
}
