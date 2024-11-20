package matnam_zang.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class InstructionDto {
    private int stepNumber;
    private String instructionDescription;
}
