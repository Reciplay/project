package com.e104.reciplay.course.courses.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.domain.Page;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class PagedResponse<T> {
    private List<T> content;
    private int page;
    private int size;
    private int totalPages;
    private long totalElements;

    public PagedResponse(Page<T> page) {
        this.content = page.getContent();
        this.page = page.getNumber();
        this.size = page.getSize();
        this.totalPages = page.getTotalPages();
        this.totalElements = page.getTotalElements();
    }
}

