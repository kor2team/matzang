package matnam_zang.demo.entity;

import java.time.LocalDateTime;
import java.util.List;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

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

// ● Recipe 테이블
// 레시피의 기본 정보 저장 (유저가 작성한 레시피)
@Entity
@Data
@ToString(exclude="user")
public class Recipe {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long recipeId;

    @ManyToOne
    @JoinColumn(name = "user_id") // recipe 테이블에서 user_id라는 컬럼으로 User 테이블의 pk를 참조함
    @OnDelete(action = OnDeleteAction.CASCADE)
    private User user;

    @Column(nullable = false) // null 허용 x
    private String title;

    @Column(columnDefinition = "TEXT") // 긴 텍스트 저장을 위해 TEXT 타입으로 정의
    private String recipeDescription;
    private int cookTime;
    private String difficultyLevel;

    @OneToMany(mappedBy = "recipe", cascade = CascadeType.ALL)
    private List<Image> images; // Recipe와 이미지는 1:N 관계

    @OneToMany(mappedBy = "recipe", cascade = CascadeType.ALL)
    private List<Ingredient> ingredients;

    @OneToMany(mappedBy = "recipe", cascade = CascadeType.ALL)
    private List<Instruction> instructions;

    @OneToMany(mappedBy = "recipe", cascade = CascadeType.ALL) // 카테고리 설정
    private List<Category> categories;

    private LocalDateTime recipeCreateAt;
    private LocalDateTime recipeUpdateAt;

    @OneToMany(mappedBy = "recipe", cascade = CascadeType.ALL)
    private List<Review> reviews;

    @OneToMany(mappedBy = "recipe", cascade = CascadeType.ALL)
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
