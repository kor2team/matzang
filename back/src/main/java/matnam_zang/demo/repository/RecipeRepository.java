package matnam_zang.demo.repository;

import matnam_zang.demo.entity.Recipe;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RecipeRepository extends JpaRepository<Recipe, Long> {
    // JpaRepository를 상속받으면 기본적인 CRUD 메서드를 사용할 수 있음
}
