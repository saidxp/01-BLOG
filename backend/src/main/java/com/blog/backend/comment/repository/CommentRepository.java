package com.blog.backend.comment.repository;

import com.blog.backend.comment.model.Comment;
import com.blog.backend.post.model.Post;
import com.blog.backend.user.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    Page<Comment> findByPostOrderByCreatedAtDesc(Post post, Pageable pageable);
    long countByPost(Post post);

    @Query("SELECT COUNT(c) FROM Comment c WHERE c.post.user = :user")
    long countByPostOwner(@Param("user") User user);

    //  In optimized query 
    @Query("""
        SELECT c.post.id, COUNT(c)
        FROM Comment c
        WHERE c.post.id IN :postIds
        GROUP BY c.post.id
    """)
    List<Object[]> countCommentsByPostIds(@Param("postIds") List<Long> postIds);
}
