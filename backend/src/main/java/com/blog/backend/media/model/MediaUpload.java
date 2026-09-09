package com.blog.backend.media.model;

import com.blog.backend.post.enums.MediaType;
import com.blog.backend.user.model.User;
import com.blog.backend.post.model.Post;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
@Entity
@Table(name = "media_uploads")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class MediaUpload {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 500)
    private String url;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "uploaded_by", nullable = false)
    private User uploadedBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id") // <-- NULLABLE. Optional link. 
    private Post post;

    @Enumerated(EnumType.STRING)
    @Column(name = "media_type", length = 20, nullable = false)
    private MediaType mediaType;

    @Column(name = "is_confirmed", nullable = false)
    @Builder.Default
    private boolean confirmed = false;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}