package matnam_zang.demo.service;

import matnam_zang.demo.entity.Category;
import matnam_zang.demo.entity.Image;
import matnam_zang.demo.entity.Ingredient;
import matnam_zang.demo.entity.Instruction;
import matnam_zang.demo.entity.Recipe;
import matnam_zang.demo.entity.User;
import matnam_zang.demo.dto.UserRecipeDto;
import matnam_zang.demo.repository.CategoryRepository;
import matnam_zang.demo.repository.ImageRepository;
import matnam_zang.demo.repository.IngredientRepository;
import matnam_zang.demo.repository.InstructionRepository;
import matnam_zang.demo.repository.RecipeRepository;
import matnam_zang.demo.repository.UserRepository;
import matnam_zang.demo.security.TokenProvider;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private RecipeRepository recipeRepository;

    @Autowired
    private ImageRepository imageRepository;

    @Autowired
    private IngredientRepository ingredientRepository;

    @Autowired
    private InstructionRepository instructionRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TokenProvider tokenProvider;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // User 생성
    public User createUser(User user) {
        return userRepository.save(user);
    }

    // User ID로 조회
    public Optional<User> getUserById(Long userId) {
        return userRepository.findById(userId);
    }

    // 특정 username을 가진 User 조회
    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    // 특정 email을 가진 User 조회
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    // 회원가입
    public void registerUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        // user.setRole(User.Role.USER);  // 기본 ROLE_USER 설정
        userRepository.save(user);
    }

    // 로그인
    public String loginUser(String username, String password) {
        // Optional<User>로 user 조회
        Optional<User> optionalUser = userRepository.findByUsername(username);
        
        // User가 존재하는지 확인
        if (optionalUser.isPresent()) {
            User user = optionalUser.get(); // 값 추출
            
            // 비밀번호가 일치하는지 확인
            if (passwordEncoder.matches(password, user.getPassword())) {
                // 로그인 성공 시 JWT 토큰 생성
                return tokenProvider.createToken(user.getUsername());
            }
        }
        
        // username이나 비밀번호가 잘못된 경우 예외 발생
        throw new RuntimeException("Invalid username or password");
    }

    @Transactional
    public Recipe createRecipe(String token, UserRecipeDto userRecipeDto) {
        String username = tokenProvider.getUsernameFromToken(token);

        if (username == null) {
            throw new RuntimeException("Invalid token or user not authenticated");
        }

        Optional<User> optionalUser = userRepository.findByUsername(username);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();

            // Recipe 엔티티 생성 및 설정
            Recipe recipe = new Recipe();
            recipe.setUser(user);
            recipe.setTitle(userRecipeDto.getTitle());
            recipe.setRecipeDescription(userRecipeDto.getRecipeDescription());
            recipe.setCookTime(userRecipeDto.getCookTime());
            recipe.setDifficultyLevel(userRecipeDto.getDifficultyLevel());

            // 이미지 저장
            List<Image> images = new ArrayList<>();
            for (String imageUrl : userRecipeDto.getImages()) {
                Image image = new Image();
                image.setRecipe(recipe);
                image.setImageUrl(imageUrl);
                images.add(image);
            }

            // 재료 저장
            List<Ingredient> ingredients = new ArrayList<>();
            for (String ingredientName : userRecipeDto.getIngredients()) {
                Ingredient ingredient = new Ingredient();
                ingredient.setRecipe(recipe);
                ingredient.setIngredientName(ingredientName);
                ingredients.add(ingredient);
            }

            // 조리과정 저장
            List<Instruction> instructions = new ArrayList<>();
            int stepNumber = 1;
            for (String instructionDescription : userRecipeDto.getInstructions()) {
                Instruction instruction = new Instruction();
                instruction.setRecipe(recipe);
                instruction.setStepNumber(stepNumber++);
                instruction.setInstructionDescription(instructionDescription);
                instructions.add(instruction);
            }

            // 카테고리 저장
            List<Category> categories = new ArrayList<>();
            for (String categoryName : userRecipeDto.getCategories()) {
                Category category = new Category();
                category.setRecipe(recipe);
                category.setCategoryName(categoryName);
                categories.add(category);
            }

            // 레시피, 이미지, 재료, 조리과정, 카테고리 저장
            recipe.setImages(images);
            recipe.setIngredients(ingredients);
            recipe.setInstructions(instructions);
            recipe.setCategories(categories);

            // 레시피 엔티티 저장
            Recipe savedRecipe = recipeRepository.save(recipe);

            // 추가적으로 관련된 엔티티들도 저장
            imageRepository.saveAll(images);
            ingredientRepository.saveAll(ingredients);
            instructionRepository.saveAll(instructions);
            categoryRepository.saveAll(categories);

            return savedRecipe;
        } else {
            throw new RuntimeException("User not found");
        }
    }

}
