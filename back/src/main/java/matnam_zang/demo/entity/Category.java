package matnam_zang.demo.entity;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.ToString;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import jakarta.persistence.*;

@Schema(description = "레시피 카테고리 정보를 저장하는 엔티티") 
@Entity
@Data
@ToString(exclude = "recipe")
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "카테고리 ID", example = "1")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "recipe_id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    @Schema(description = "해당 카테고리가 속한 레시피 엔티티", example = "Recipe 객체")
    private Recipe recipe;

    @Schema(description = "카테고리 이름", example = "디저트")
    private String categoryName; 
}
