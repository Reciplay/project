package com.e104.reciplay.s3.util;

import com.e104.reciplay.s3.enums.FileCategory;
import com.e104.reciplay.s3.enums.RelatedType;
import com.e104.reciplay.s3.exception.IllegalFileTypeException;
import com.e104.reciplay.s3.exception.TooBigFileSizeException;
import org.apache.commons.io.FilenameUtils;
import org.apache.tomcat.util.http.fileupload.impl.FileSizeLimitExceededException;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.services.s3.endpoints.internal.Value;

import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;

public final class CustomFileUtil {

    // VIDEOS, MATERIALS, IMAGES
    private static Map<FileCategory, HashSet<String>> extensionMap = new HashMap<>();
    private static Map<RelatedType, FileCategory> categoryForTypes = new HashMap<>();

    static  {
        extensionMap.put(FileCategory.VIDEOS, new HashSet<>(List.of("mp4", "avi", "mov", "mkv")));
        extensionMap.put(FileCategory.IMAGES, new HashSet<>(List.of("jpg", "jpeg", "png", "gif", "webp")));
        extensionMap.put(FileCategory.MATERIALS, new HashSet<>(List.of("pdf", "docx", "pptx", "xlsx", "txt", "zip")));

        categoryForTypes.put(RelatedType.LECTURE, FileCategory.MATERIALS);
        categoryForTypes.put(RelatedType.REPLAY, FileCategory.VIDEOS);
        categoryForTypes.put(RelatedType.COURSE_COVER, FileCategory.IMAGES);
        categoryForTypes.put(RelatedType.THUMBNAIL, FileCategory.IMAGES);
        categoryForTypes.put(RelatedType.INSTRUCTOR_BANNER, FileCategory.IMAGES);
        categoryForTypes.put(RelatedType.SPECIAL_BANNER, FileCategory.IMAGES);
        categoryForTypes.put(RelatedType.USER_PROFILE, FileCategory.IMAGES);

    }

    public static void validateFile(MultipartFile file, FileCategory category, RelatedType relatedType) {
        if(file.getSize() > 2 * 1000 * 1000 * 1000) throw new TooBigFileSizeException("파일이 너무 큽니다. (2GB 이하의 파일만 업로드 가능)");
        if(categoryForTypes.get(relatedType) != category) throw new IllegalFileTypeException("제공된 파일의 연관 개체와 용도가 일치하지 않습니다.");
        String ext = FilenameUtils.getExtension(file.getOriginalFilename()).toLowerCase();
        if(ext.isEmpty()) throw new IllegalFileTypeException("제공된 파일에 확장자가 없습니다.");
        if(!extensionMap.get(category).contains(ext)) throw new IllegalFileTypeException("제공된 파일 확장자와 용도가 일치하지 않습니다.");

    }
}
