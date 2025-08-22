package com.e104_2.reciplaywebsocket.room.repository;

import com.e104_2.reciplaywebsocket.entity.Lecture;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LectureRepository extends JpaRepository<Lecture, Long> {
}
