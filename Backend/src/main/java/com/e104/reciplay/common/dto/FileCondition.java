package com.e104.reciplay.common.dto;

import com.e104.reciplay.s3.enums.FileCategory;
import com.e104.reciplay.s3.enums.RelatedType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FileCondition {
    private FileCategory fileCategory;
    private RelatedType relatedType;
    private MultipartFile file;
    private Long relatedId;
    private Integer sequuence;
}
