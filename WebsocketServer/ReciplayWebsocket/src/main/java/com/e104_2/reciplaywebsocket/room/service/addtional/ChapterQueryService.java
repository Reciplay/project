package com.e104_2.reciplaywebsocket.room.service.addtional;

import com.e104_2.reciplaywebsocket.entity.Chapter;

public interface ChapterQueryService {
    Chapter queryChapterByLectureIdAndSequence(Long lectureId, Integer sequence);
}
