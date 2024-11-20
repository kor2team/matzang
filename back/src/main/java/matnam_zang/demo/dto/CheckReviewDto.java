package matnam_zang.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CheckReviewDto {
    private String comment;
    private Long userId;
    private Long reviewId;
    
}
