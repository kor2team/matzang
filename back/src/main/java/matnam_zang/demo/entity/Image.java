package matnam_zang.demo.entity;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;
import lombok.ToString;

@Schema(description = "레시피와 연결된 이미지 정보를 저장하는 엔티티")
@Entity
@Data
@ToString(exclude = "recipe")
public class Image {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "이미지의 고유 ID", example = "1")
    private Long imageId;

    @ManyToOne
    @JoinColumn(name = "recipe_id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    @Schema(description = "이미지가 연결된 레시피 엔티티", example = "Recipe 객체")
    private Recipe recipe;

    @Column(nullable = false)
    @Schema(description = "이미지의 URL", example = "https://example.com/image.jpg")
    private String imageUrl;
}
