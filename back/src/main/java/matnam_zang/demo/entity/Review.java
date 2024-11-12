package matnam_zang.demo.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

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

// 리뷰 테이블 : 사용자가 작성한 리뷰 저장
@Entity
@Data
@ToString(exclude = {"recipe", "user"})
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long reviewId;

    @ManyToOne
    @JoinColumn(name = "recipe_id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Recipe recipe;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private User user;

    private String comment;
    private LocalDateTime reviewCreateAt;
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
}
