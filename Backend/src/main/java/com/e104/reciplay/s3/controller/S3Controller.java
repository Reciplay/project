package com.e104.reciplay.s3.controller;

import com.e104.reciplay.common.response.dto.ResponseRoot;
import com.e104.reciplay.common.response.util.CommonResponseBuilder;
import com.e104.reciplay.s3.dto.response.ResponseFileInfo;
import com.e104.reciplay.s3.enums.FileCategory;
import com.e104.reciplay.s3.enums.RelatedType;
import com.e104.reciplay.s3.service.S3Service;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/files")
public class S3Controller {

    private final S3Service s3Service;

    @PostMapping("")
    public ResponseEntity<ResponseRoot<String>> upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam("relatedId") Long relatedId
    ) throws IOException {
        s3Service.uploadFile(file, relatedId);
        return CommonResponseBuilder.success("파일 업로드에 성공하였습니다.", null);
    }

    @GetMapping("")
    public ResponseEntity<ResponseRoot<ResponseFileInfo>> getPresignedUrl(
            @RequestParam("category") FileCategory category,
            @RequestParam("relatedType") RelatedType relatedType,
            @RequestParam("relatedId") Long relatedId,
            @RequestParam("sequence") Integer sequence
    ) {
        ResponseFileInfo responseFileInfo = s3Service.getResponseFileInfo(category, relatedType, relatedId, sequence);
        return CommonResponseBuilder.success("Presigned Url 생성에 성공하였습니다.", responseFileInfo);
    }

    @DeleteMapping("")
    public ResponseEntity<ResponseRoot<String>> deleteFile(
            @RequestParam("category") FileCategory category,
            @RequestParam("relatedType") RelatedType relatedType,
            @RequestParam("relatedId") Long relatedId,
            @RequestParam("sequence") Integer sequence
    ) {
        s3Service.deleteFile(category, relatedType, relatedId, sequence);
        return CommonResponseBuilder.success("파일이 성공적으로 삭제되었습니다.", null);
    }

}


