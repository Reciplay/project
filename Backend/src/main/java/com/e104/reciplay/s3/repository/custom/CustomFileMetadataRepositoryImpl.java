package com.e104.reciplay.s3.repository.custom;

import com.e104.reciplay.entity.FileMetadata;
import com.e104.reciplay.entity.QFileMetadata;
import com.e104.reciplay.s3.enums.FileCategory;
import com.e104.reciplay.s3.enums.RelatedType;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class CustomFileMetadataRepositoryImpl implements CustomFileMetadataRepository {
    private final JPAQueryFactory queryFactory;

    private final QFileMetadata fileMetadata = QFileMetadata.fileMetadata;

    @Override
    public Optional<FileMetadata> findMetadata(FileCategory category, RelatedType relatedType, Long relatedId, Integer sequence) {
        return Optional.ofNullable(
                queryFactory
                        .selectFrom(fileMetadata)
                        .where(
                                fileMetadata.category.eq(category),
                                fileMetadata.relatedType.eq(relatedType),
                                fileMetadata.relatedId.eq(relatedId),
                                fileMetadata.sequence.eq(sequence)
                        )
                        .orderBy(fileMetadata.uploadedAt.desc())
                        .fetchFirst() // null이 될 수 있으므로 Optional로 감쌈
        );
    }
}
