package matnam_zang.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import matnam_zang.demo.dto.CheckReviewDto;
import matnam_zang.demo.entity.Review;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    @Query("SELECT COUNT(r) FROM Review r WHERE r.recipe.id = :recipeId")
    long countByRecipeId(@Param("recipeId") Long recipeId);

    
    @Query("SELECT new matnam_zang.demo.dto.CheckReviewDto(r.comment, r.user.username, r.reviewId) FROM Review r WHERE r.recipe.id = :recipeId")
    List<CheckReviewDto> checkReviewRecipeId(@Param("recipeId") Long recipeId);

    


    // JpaRepository를 상속받으면 기본적인 CRUD 메서드를 사용할 수 있음
}
