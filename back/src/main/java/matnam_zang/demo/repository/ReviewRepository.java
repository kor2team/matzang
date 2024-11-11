package matnam_zang.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import matnam_zang.demo.entity.Review;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    // JpaRepository를 상속받으면 기본적인 CRUD 메서드를 사용할 수 있음
}
