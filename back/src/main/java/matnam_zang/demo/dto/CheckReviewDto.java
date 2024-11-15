package matnam_zang.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CheckReviewDto {
    private String comment;
    private Long userId;
    
}
