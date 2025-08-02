package com.e104.reciplay.s3.repository;

import com.e104.reciplay.s3.domain.FileMetadata;
import com.e104.reciplay.s3.repository.custom.CustomFileMetadataRepository;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FileMetadataRepository extends JpaRepository<FileMetadata, Long>, CustomFileMetadataRepository {

}
