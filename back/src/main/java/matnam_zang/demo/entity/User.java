package matnam_zang.demo.entity;

import java.time.LocalDateTime;
import java.util.List;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "user")
@Schema(description = "사용자 정보 저장을 위한 엔티티")
public class User {
    
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY) 
    @Schema(description = "사용자 ID", example = "1")
    private Long userId;

    @Schema(description = "사용자 이름", example = "john_doe")
    private String username;

    @Schema(description = "사용자 이메일", example = "john.doe@example.com")
    private String email;

    @Schema(description = "사용자 비밀번호", example = "password123")
    private String password;

    @Schema(description = "사용자 계정 생성일", example = "2024-11-13T15:53:02")
    private LocalDateTime userCreateAt;

    @Schema(description = "사용자 계정 수정일", example = "2024-11-14T10:00:00")
    private LocalDateTime userUpdateAt;

    @OneToMany(mappedBy = "user") 
    @Schema(description = "사용자가 작성한 레시피 목록")
    private List<Recipe> recipes;

    @OneToMany(mappedBy = "user")
    @Schema(description = "사용자가 작성한 리뷰 목록")
    private List<Review> reviews;

    @OneToMany(mappedBy = "user")
    @Schema(description = "사용자가 좋아요한 레시피 목록")
    private List<Favorite> favorites;

    // 엔티티가 처음 저장되기 전에 호출되어 userCreateAt 설정
    @PrePersist
    public void prePersist() {
        this.userCreateAt = LocalDateTime.now(); // 엔티티 처음 생성 시 현재 시간 설정
        this.userUpdateAt = LocalDateTime.now(); // 엔티티 처음 생성 시 현재 시간 설정
    }

    // 엔티티가 업데이트되기 전에 호출되어 userUpdateAt 갱신
    @PreUpdate
    public void preUpdate() {
        this.userUpdateAt = LocalDateTime.now(); // 엔티티 수정 시 현재 시간 설정
    }
}
