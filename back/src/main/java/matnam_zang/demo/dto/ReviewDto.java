package matnam_zang.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ReviewDto {
    private String review; // 요청 본문에서 review라는 키 매핑
}
