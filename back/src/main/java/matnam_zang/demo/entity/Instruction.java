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

@Schema(description = "조리과정을 순서대로 저장하는 엔티티")
@Entity
@Data
@ToString(exclude = "recipe")
public class Instruction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "조리과정 ID", example = "1")
    private Long instructionId;

    @ManyToOne
    @JoinColumn(name = "recipe_id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    @Schema(description = "조리과정이 속한 레시피 엔티티", example = "Recipe 객체")
    private Recipe recipe;

    @Schema(description = "조리 단계 번호", example = "1")
    private int stepNumber;

    @Schema(description = "조리과정 설명", example = "먼저 팬에 기름을 두르고 예열합니다.")
    private String instructionDescription;
}
