package matnam_zang.demo.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import matnam_zang.demo.entity.Favorite;
import matnam_zang.demo.entity.Recipe;
import matnam_zang.demo.entity.User;


public interface FavoriteRepository extends JpaRepository<Favorite, Long> {

    Optional<Favorite> findByUserAndRecipe(User user, Recipe recipe);


    // recipeId에 대한 즐겨찾기 수를 세는 메서드
    @Query("SELECT COUNT(f) FROM Favorite f WHERE f.recipe.id = :recipeId")
    long countByRecipeId(@Param("recipeId") Long recipeId);


    @Query("SELECT CASE WHEN COUNT(f) > 0 THEN true ELSE false END FROM Favorite f WHERE f.user.id = :userId AND f.recipe.id = :recipeId")
    boolean checkUserFavorite(@Param("userId") Long userId, @Param("recipeId") Long recipeId);

    
    
}
