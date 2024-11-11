package matnam_zang.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import matnam_zang.demo.entity.Image;

@Repository
public interface ImageRepository extends JpaRepository<Image, Long> {
    // 필요에 따라 추가적인 쿼리 메서드를 정의할 수 있습니다.
}
