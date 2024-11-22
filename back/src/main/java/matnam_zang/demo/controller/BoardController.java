package matnam_zang.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import matnam_zang.demo.dto.BoardRecipeDto;
import matnam_zang.demo.dto.BoardRecipesDto;
import matnam_zang.demo.service.BoardService;


@RestController
@RequestMapping("/api/all")
public class BoardController {

    @Autowired
    private BoardService boardService;

    // 전체 레시피 외부 확인
    @GetMapping("/getRecipePostBeforeAccess")
    public ResponseEntity<?> findUserRecipes(){
        try {
            List<BoardRecipesDto> findUserRecipes = boardService.getRecipePostBeforeAccess();
            return ResponseEntity.ok(findUserRecipes);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Error creating recipes : " + e.getMessage());
        }
    }

    // 전체 레시피 내부 확인
    @GetMapping("/getRecipePostAfterAccess")
    public ResponseEntity<?> findUserRecipe(@RequestHeader("Authorization") String token){
        try{
            List<BoardRecipeDto> findUserRecipe = boardService.getRecipePostAfterAccess(token);
            return ResponseEntity.ok(findUserRecipe);
        }catch(RuntimeException e){
            return ResponseEntity.badRequest().body("Error creating recipe : " + e.getMessage());
        }
    }

    
    
    
}
