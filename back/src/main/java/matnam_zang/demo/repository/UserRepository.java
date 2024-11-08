package matnam_zang.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import matnam_zang.demo.entity.User;

// User 엔티티의 DAO 역할을 하는 Repository 인터페이스
public interface UserRepository extends JpaRepository<User, Long> {
    // 추가적으로 필요한 사용자 정의 메서드

    // 특정 username으로 User를 조회하는 메서드
    Optional<User> findByUsername(String username);

    // 특정 email로 User를 조회하는 메서드
    Optional<User> findByEmail(String email);

    // username과 email로 User가 존재하는지 여부 확인
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
}
