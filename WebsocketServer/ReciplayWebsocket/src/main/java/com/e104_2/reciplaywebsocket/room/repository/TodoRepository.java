package com.e104_2.reciplaywebsocket.room.repository;

import com.e104_2.reciplaywebsocket.entity.Todo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TodoRepository extends JpaRepository<Todo, Long> {
    List<Todo> findByChapterId(Long chapterId);
}
