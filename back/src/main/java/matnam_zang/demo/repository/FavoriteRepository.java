package matnam_zang.demo.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import matnam_zang.demo.entity.Favorite;
import matnam_zang.demo.entity.Recipe;
import matnam_zang.demo.entity.User;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {

    Optional<Favorite> findByUserAndRecipe(User user, Recipe recipe);
    
}
