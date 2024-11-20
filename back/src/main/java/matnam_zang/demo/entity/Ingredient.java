package matnam_zang.demo.entity;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;
import lombok.ToString;

@Schema(description = "레시피에 사용되는 개별 재료 정보를 저장하는 엔티티")
@Entity
@Data
@ToString(exclude = "recipe")
public class Ingredient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "재료 ID", example = "1")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "recipe_id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    @Schema(description = "재료가 속한 레시피 엔티티", example = "Recipe 객체")
    private Recipe recipe;

    @Schema(description = "재료 이름", example = "설탕")
    private String ingredientName;
    
}
