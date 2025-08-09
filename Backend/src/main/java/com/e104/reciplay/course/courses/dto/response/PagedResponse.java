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
    private Boolean hasNext;
    private Boolean hasPrevious;


    public static <T> PagedResponse<T> from(Page<?> meta, List<T> content) {
        return PagedResponse.<T>builder()
                .content(content)
                .page(meta.getNumber())
                .size(meta.getSize())
                .totalPages(meta.getTotalPages())
                .totalElements(meta.getTotalElements())
                .hasNext(meta.hasNext())
                .hasPrevious(meta.hasPrevious())
                .build();
    }

}

