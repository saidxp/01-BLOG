package com.blog.backend.post.repository;

import com.blog.backend.post.model.Post;
import com.blog.backend.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

    Page<Post> findByUserOrderByCreatedAtDesc(User user, Pageable page);

    long countByUser(User user);

    Page<Post> findAllByOrderByCreatedAtDesc(Pageable pageable);

    // <<===>> \\ {<<!!>>}
    //
   
    @Query("SELECT p FROM Post p JOIN Subscription s ON s.subscribedTo.id = p.user.id WHERE s.subscriber.username = :username ORDER BY p.createdAt DESC")
            
    Page<Post> findPostsFromSubscribedUsers(
            @Param("username") String username,
            Pageable pageable);
}
