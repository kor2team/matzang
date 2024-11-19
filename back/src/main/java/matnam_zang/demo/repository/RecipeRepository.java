package matnam_zang.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import matnam_zang.demo.entity.Recipe;

public interface RecipeRepository extends JpaRepository<Recipe, Long> {

  // List<Recipe> findAll(User user);
  // JpaRepository를 상속받으면 기본적인 CRUD 메서드를 사용할 수 있음

  @Query("SELECT (r.cookTime) FROM Recipe r WHERE r.recipeId = :recipeId")
  Integer cookingTime(@Param("recipeId") Long recipeId);

    

}
