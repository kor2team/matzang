package matnam_zang.demo.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import lombok.Data;
import lombok.ToString;

@Entity
@Data
@ToString(exclude = {"recipe", "user"})
@Schema(description = "사용자가 작성한 리뷰를 저장하는 엔티티")
public class Review {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "리뷰 ID", example = "1")
    private Long reviewId;

    @ManyToOne
    @JoinColumn(name = "recipe_id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    @Schema(description = "리뷰가 속한 레시피 정보", example = "Recipe 객체")
    private Recipe recipe;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    @Schema(description = "리뷰를 작성한 유저 정보", example = "User 객체")
    private User user;

    @Schema(description = "리뷰 내용", example = "이 레시피 정말 좋아요!")
    private String comment;

    @Schema(description = "리뷰 생성일", example = "2024-11-13T10:00:00")
    private LocalDateTime reviewCreateAt;

    @Schema(description = "리뷰 수정일", example = "2024-11-14T11:00:00")
    private LocalDateTime reviewUpdateAt;

    // 엔티티가 처음 저장되기 전에 호출되어 recipeCreateAt 설정
    @PrePersist
    public void prePersist() {
        this.reviewCreateAt = LocalDateTime.now(); // 엔티티 처음 생성 시 현재 시간 설정
        this.reviewUpdateAt = LocalDateTime.now(); // 엔티티 처음 생성 시 현재 시간 설정
    }

    // 엔티티가 업데이트되기 전에 호출되어 recipeUpdateAt 갱신
    @PreUpdate
    public void preUpdate() {
        this.reviewUpdateAt = LocalDateTime.now(); // 엔티티 수정 시 현재 시간 설정
    }

    public void setId(Long reviewId2) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'setId'");
    }
}
