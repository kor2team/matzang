package matnam_zang.demo.entity;

import java.time.LocalDateTime;
import java.util.List;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import lombok.Data;
import lombok.ToString;

@Schema(description = "유저가 작성한 레시피의 기본 정보를 저장하는 엔티티")
@Entity
@Data
@ToString(exclude="user")
public class Recipe {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "레시피 ID", example = "1")
    private Long recipeId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    @Schema(description = "레시피를 작성한 유저 정보", example = "User 객체")
    private User user;

    @Column(nullable = false) 
    @Schema(description = "레시피 제목", example = "초콜릿 케이크")
    private String title;

    @Column(columnDefinition = "TEXT")
    @Schema(description = "레시피 설명", example = "간단한 초콜릿 케이크 레시피입니다.")
    private String recipeDescription;

    @Schema(description = "조리 시간 (분 단위)", example = "45")
    private int cookTime;

    @Schema(description = "난이도 수준", example = "중간")
    private String difficultyLevel;

    @OneToMany(mappedBy = "recipe", cascade = CascadeType.ALL)
    @Schema(description = "레시피에 포함된 이미지 목록")
    private List<Image> images; 

    @OneToMany(mappedBy = "recipe", cascade = CascadeType.ALL)
    @Schema(description = "레시피에 포함된 재료 목록")
    private List<Ingredient> ingredients;

    @OneToMany(mappedBy = "recipe", cascade = CascadeType.ALL)
    @Schema(description = "레시피의 조리과정 목록")
    private List<Instruction> instructions;

    @OneToMany(mappedBy = "recipe", cascade = CascadeType.ALL) // 카테고리 설정
    @Schema(description = "레시피에 포함된 카테고리 목록")
    private List<Category> categories;

    @Schema(description = "레시피 생성일")
    private LocalDateTime recipeCreateAt;

    @Schema(description = "레시피 수정일")
    private LocalDateTime recipeUpdateAt;

    @OneToMany(mappedBy = "recipe", cascade = CascadeType.ALL)
    @Schema(description = "레시피에 대한 리뷰 목록")
    private List<Review> reviews;

    @OneToMany(mappedBy = "recipe", cascade = CascadeType.ALL)
    @Schema(description = "레시피에 대한 좋아요 목록")
    private List<Favorite> favorites;

    // 엔티티가 처음 저장되기 전에 호출되어 recipeCreateAt 설정
    @PrePersist
    public void prePersist() {
        this.recipeCreateAt = LocalDateTime.now(); // 엔티티 처음 생성 시 현재 시간 설정
        this.recipeUpdateAt = LocalDateTime.now(); // 엔티티 처음 생성 시 현재 시간 설정
    }

    // 엔티티가 업데이트되기 전에 호출되어 recipeUpdateAt 갱신
    @PreUpdate
    public void preUpdate() {
        this.recipeUpdateAt = LocalDateTime.now(); // 엔티티 수정 시 현재 시간 설정
    }
}
