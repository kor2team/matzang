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

@Schema(description = "레시피에 게시물에 대한 사용자의 좋아요 정보를 저장하는 엔티티")
@Entity
@Data
@ToString(exclude = {"recipe", "user"})
public class Favorite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "좋아요 ID", example = "1")
    private Long favoriteId;

    @ManyToOne
    @JoinColumn(name = "recipe_id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    @Schema(description = "좋아요가 설정된 레시피 엔티티", example = "Recipe 객체")
    private Recipe recipe;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    @Schema(description = "좋아요를 한 사용자 엔티티", example = "User 객체")
    private User user;
}
