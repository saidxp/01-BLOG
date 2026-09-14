package com.blog.backend.likes.repository;


import com.blog.backend.likes.model.Like;
import com.blog.backend.post.model.Post;
import com.blog.backend.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface LikeRepository extends JpaRepository<Like, Long> {
    // <<==>> \\
    boolean existsByUserAndPost(User user, Post post);
    Optional<Like> findByUserAndPost(User user, Post post);
    long countByPost(Post post);

    // her it in omptimized query for fetching the data :
     @Query("""
        SELECT l.post.id, COUNT(l)
        FROM Like l
        WHERE l.post.id IN :postIds
        GROUP BY l.post.id
    """)
    List<Object[]> countLikesByPostIds(@Param("postIds") List<Long> postIds);
    // <<==>> \\ (<!!>)
}