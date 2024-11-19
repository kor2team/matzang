package matnam_zang.demo.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import jakarta.transaction.Transactional;
import matnam_zang.demo.dto.BoardRecipeDto;
import matnam_zang.demo.dto.BoardRecipesDto;
import matnam_zang.demo.dto.CheckReviewDto;
import matnam_zang.demo.dto.ImageDto;
import matnam_zang.demo.dto.IngredientDto;
import matnam_zang.demo.dto.InstructionDto;
import matnam_zang.demo.dto.ReviewDto;
import matnam_zang.demo.dto.UserRecipeDto;
import matnam_zang.demo.entity.Category;
import matnam_zang.demo.entity.Favorite;
import matnam_zang.demo.entity.Image;
import matnam_zang.demo.entity.Ingredient;
import matnam_zang.demo.entity.Instruction;
import matnam_zang.demo.entity.Recipe;
import matnam_zang.demo.entity.Review;
import matnam_zang.demo.entity.User;
import matnam_zang.demo.repository.CategoryRepository;
import matnam_zang.demo.repository.FavoriteRepository;
import matnam_zang.demo.repository.ImageRepository;
import matnam_zang.demo.repository.IngredientRepository;
import matnam_zang.demo.repository.InstructionRepository;
import matnam_zang.demo.repository.RecipeRepository;
import matnam_zang.demo.repository.ReviewRepository;
import matnam_zang.demo.repository.UserRepository;
import matnam_zang.demo.security.TokenProvider;

@Transactional // 트랜잭션을 명시적으로 관리하여 해당 메소드 내 db작업이 원자적으로 처리되어 예상대로 동작
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

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private FavoriteRepository favoriteRepository;


    // 유저 조회 (유저 id)
    public Optional<User> getUserById(Long userId) {
        return userRepository.findById(userId);
    }

    // 유저 조회 (유저 name)
    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    // 유저 조회 (유저 email)
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    // 회원가입
    public void registerUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        // user.setRole(User.Role.USER); // 기본 ROLE_USER 설정
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

    // 게시물 작성
    public Recipe createRecipe(String token, UserRecipeDto userRecipeDto) {

        String bearerToken = token.substring(7);

        // 1. 토큰 검증
        if (tokenProvider.isTokenExpired(bearerToken)) {
            throw new RuntimeException("Token has expired");
        }

        String username = tokenProvider.getUsernameFromToken(bearerToken);

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

            // 추가적으로 관련된 엔티티들도 저장 (엔티티의 리스트내부 각 엔티티를 한번에 쿼리로 여러 row로서 집어넣음)
            imageRepository.saveAll(images);
            ingredientRepository.saveAll(ingredients);
            instructionRepository.saveAll(instructions);
            categoryRepository.saveAll(categories);

            return savedRecipe;
        } else {
            throw new RuntimeException("User not found");
        }
    }

    // 게시물 수정
    public Recipe updateRecipe(String token, Long recipeId, UserRecipeDto updatedRecipeDto) {

        String bearerToken = token.substring(7);

        // 1. 토큰 검증
        if (tokenProvider.isTokenExpired(bearerToken)) {
            throw new RuntimeException("Token has expired");
        }

        // 2. 토큰에서 사용자명 추출
        String username = tokenProvider.getUsernameFromToken(bearerToken);

        // 3. 수정할 레시피 찾기
        Recipe recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new RuntimeException("Recipe not found"));

        // 4. 게시물 작성자가 요청한 사용자와 일치하는지 확인
        if (!recipe.getUser().getUsername().equals(username)) {
            throw new RuntimeException("User not authorized to update this recipe");
        }

        // 5. 수정할 데이터만 갱신
        recipe.setTitle(updatedRecipeDto.getTitle());
        recipe.setRecipeDescription(updatedRecipeDto.getRecipeDescription());
        recipe.setCookTime(updatedRecipeDto.getCookTime());
        recipe.setDifficultyLevel(updatedRecipeDto.getDifficultyLevel());

        // 6. 기존 데이터 삭제
        // 기존 이미지 삭제 (명시적으로 삭제)
        imageRepository.deleteAll(recipe.getImages());
        ingredientRepository.deleteAll(recipe.getIngredients());
        instructionRepository.deleteAll(recipe.getInstructions());
        categoryRepository.deleteAll(recipe.getCategories());

        // 7. 새로운 이미지 추가
        List<Image> newImages = new ArrayList<>();
        for (String imageUrl : updatedRecipeDto.getImages()) {
            Image image = new Image();
            image.setRecipe(recipe);
            image.setImageUrl(imageUrl);
            newImages.add(image);
        }
        recipe.setImages(newImages); // 새로운 이미지 리스트 설정

        // 8. 새로운 재료 추가
        List<Ingredient> newIngredients = new ArrayList<>();
        for (String ingredientName : updatedRecipeDto.getIngredients()) {
            Ingredient ingredient = new Ingredient();
            ingredient.setRecipe(recipe);
            ingredient.setIngredientName(ingredientName);
            newIngredients.add(ingredient);
        }
        recipe.setIngredients(newIngredients);

        // 9. 새로운 조리과정 추가
        List<Instruction> newInstructions = new ArrayList<>();
        int stepNumber = 1;
        for (String instructionDescription : updatedRecipeDto.getInstructions()) {
            Instruction instruction = new Instruction();
            instruction.setRecipe(recipe);
            instruction.setStepNumber(stepNumber++);
            instruction.setInstructionDescription(instructionDescription);
            newInstructions.add(instruction);
        }
        recipe.setInstructions(newInstructions); // 새로운 조리과정 리스트 설정

        // 10. 새로운 카테고리 추가
        List<Category> newCategories = new ArrayList<>();
        for (String categoryName : updatedRecipeDto.getCategories()) {
            Category category = new Category();
            category.setRecipe(recipe);
            category.setCategoryName(categoryName);
            newCategories.add(category);
        }
        recipe.setCategories(newCategories); // 새로운 카테고리 리스트 설정

        // 11. 레시피 저장
        Recipe updatedRecipe = recipeRepository.save(recipe); // Cascade 옵션으로 인해 관계형 엔티티도 자동으로 저장됩니다.

        return updatedRecipe;
    }

    // 게시물 삭제
    public void deleteRecipe(String token, Long recipeId) {

        String bearerToken = token.substring(7);

        // 1. 토큰 검증
        if (tokenProvider.isTokenExpired(bearerToken)) {
            throw new RuntimeException("Token has expired");
        }

        String username = tokenProvider.getUsernameFromToken(bearerToken); // 토큰에서 사용자명 추출

        Recipe recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new RuntimeException("Recipe not found"));

        // 게시물 작성자가 요청한 사용자와 일치하는지 확인
        if (!recipe.getUser().getUsername().equals(username)) {
            throw new RuntimeException("User not authorized to delete this recipe");
        }

        // 삭제 수행
        recipeRepository.delete(recipe);
    }
    
    // 나의 레시피 외부 확인
    public List<BoardRecipesDto> getRecipePostBeforeAccess(String token){
        String username = tokenProvider.getUsernameFromToken(token);

        if (username == null) {
            throw new RuntimeException("Invalid token or user not authenticated");
        }

        Optional<User> optionalUser = userRepository.findByUsername(username); // User 정보 조회
        if(optionalUser.isPresent()){
            User user = optionalUser.get();

            // 사용자 ID로 필터링하여 레시피를 조회합니다.
            List<Recipe> recipes = recipeRepository.findAll().stream()
                    .filter(recipe -> recipe.getUser().getUserId().equals(user.getUserId()))
                    .collect(Collectors.toList());

            // 각 레시피에 대한 이미지를 미리 조회합니다.
             Map<Long, List<Image>> recipeImagesMap = imageRepository.findAll().stream()
                   .collect(Collectors.groupingBy(image -> image.getRecipe().getRecipeId()));

            // 레시피 DTO 리스트를 생성합니다.
            List<BoardRecipesDto> myRecipesDtos = recipes.stream()
                    .map(recipe -> {
                        List<Image> images = recipeImagesMap.getOrDefault(recipe.getRecipeId(),
                                Collections.emptyList());
                        List<ImageDto> imageDtos = images.stream()
                                .map(image -> new ImageDto(image.getImageId(), image.getImageUrl()))
                                .collect(Collectors.toList());

                        

                        return new BoardRecipesDto(recipe.getRecipeId(), recipe.getTitle(), imageDtos);
                    })
                    .collect(Collectors.toList());
            return myRecipesDtos;
        } else {
            throw new RuntimeException("User not found");
        }
    }

    // 나의 레시피 내부 확인(나의 레시피 클릭시 상세목록)
    public List<BoardRecipeDto> getRecipePostAfterAccess(String token) {
        String username = tokenProvider.getUsernameFromToken(token);

        if (username == null) {
            throw new RuntimeException("Invalid token or user not authenticated");
        }

        Optional<User> optionalUser = userRepository.findByUsername(username); // User 정보 조회

        if (optionalUser.isPresent()) {
            // userRecipe list를 return해줘야함
            // recipeRepository의 연결된 entity에는 user_id(user로 받은 id)를 통해 해당 recipes 찾아야함
            User user = optionalUser.get();

            // 사용자 ID로 필터링하여 레시피를 조회합니다.
            List<Recipe> recipes = recipeRepository.findAll().stream()
                    .filter(recipe -> recipe.getUser().getUserId().equals(user.getUserId()))
                    .collect(Collectors.toList());

            // 각 레시피에 대한 이미지를 미리 조회합니다.
            Map<Long, List<Image>> recipeImagesMap = imageRepository.findAll().stream()
                    .collect(Collectors.groupingBy(image -> image.getRecipe().getRecipeId()));
            Map<Long, List<Ingredient>> recipeIngredientsMap = ingredientRepository.findAll().stream()
                    .collect(Collectors.groupingBy(ingredient -> ingredient.getRecipe().getRecipeId()));
            Map<Long, List<Instruction>> recipeInstructionsMap = instructionRepository.findAll().stream()
                    .collect(Collectors.groupingBy(instruction -> instruction.getRecipe().getRecipeId()));

            // 레시피 DTO 리스트를 생성합니다.
            List<BoardRecipeDto> myRecipeDtos = recipes.stream()
                    .map(recipe -> {
                        List<Image> images = recipeImagesMap.getOrDefault(recipe.getRecipeId(),
                                Collections.emptyList());
                        List<ImageDto> imageDtos = images.stream()
                                .map(image -> new ImageDto(image.getImageId(), image.getImageUrl()))
                                .collect(Collectors.toList());


                        // cookTime
                        int cookTime = recipeRepository.cookingTime(recipe.getRecipeId());

                        List<Ingredient> ingredients = recipeIngredientsMap.getOrDefault(recipe.getRecipeId(),
                                Collections.emptyList());
                        List<IngredientDto> ingredientDtos = ingredients.stream()
                                .map(ingredient -> new IngredientDto(ingredient.getIngredient()))
                                .collect(Collectors.toList());

                        List<Instruction> instructions = recipeInstructionsMap.getOrDefault(recipe.getRecipeId(),
                                Collections.emptyList());
                        List<InstructionDto> instructionDtos = instructions.stream()
                                .map(instruction -> new InstructionDto(instruction.getStepNumber(), instruction.getInstructionDescription()))
                                .collect(Collectors.toList());
                        // 좋아요 수를 계산합니다.
                        long favoriteCount = favoriteRepository.countByRecipeId(recipe.getRecipeId());

                        // 댓글 수를 계산합니다.
                        long reviewCount = reviewRepository.countByRecipeId(recipe.getRecipeId());

                        // 현재 user가 좋아요를 하였는지의 여부를 확인합니다.
                        boolean userFavorite = favoriteRepository.checkUserFavorite(user.getUserId(), recipe.getRecipeId());

                        // 현재 review 상황을 체크합니다.
                        List<CheckReviewDto> reviews = reviewRepository.checkReviewRecipeId(recipe.getRecipeId());

                        

                        return new BoardRecipeDto(recipe.getRecipeId(), recipe.getTitle(), imageDtos,
                                recipe.getRecipeDescription(), recipe.getUser().getUserId(), favoriteCount, reviewCount, userFavorite, reviews, cookTime,ingredientDtos,instructionDtos);
                    })
                    .collect(Collectors.toList());
            return myRecipeDtos;
        } else {
            throw new RuntimeException("User not found");
        }
    }

    // 리뷰 작성
    public void createReview(String token, Long recipeId, ReviewDto reviewDto) {
        String bearerToken = token.substring(7);

        // 1. 토큰 검증
        if (tokenProvider.isTokenExpired(bearerToken)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token has expired");
        }

        String username = tokenProvider.getUsernameFromToken(bearerToken); // 토큰에서 사용자명 추출

        Recipe recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new RuntimeException("Recipe not found"));

        Optional<User> optionalUser = userRepository.findByUsername(username);
        if (optionalUser.isPresent()) {
            User user = optionalUser.orElseThrow(() -> new RuntimeException("User not found"));

            // Review 엔티티 생성 및 설정
            Review review = new Review();
            review.setUser(user);
            review.setRecipe(recipe);
            review.setComment(reviewDto.getReview());

            // 리뷰 생성
            reviewRepository.save(review);
        }
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Not found User");
    }

    // 리뷰 수정
    public void updateReview(String token, Long reviewId, ReviewDto reviewDto) {
        String bearerToken = token.substring(7);

        // 1. 토큰 검증
        if (tokenProvider.isTokenExpired(bearerToken)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token has expired");
        }

        String username = tokenProvider.getUsernameFromToken(bearerToken); // 토큰에서 사용자명 추출

        // 2. 사용자 찾기
        Optional<User> optionalUser = userRepository.findByUsername(username);
        User user = optionalUser.orElseThrow(() -> new RuntimeException("User not found"));

        // 3. 수정하려는 리뷰 찾기
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        // 4. 작성자 검증
        if (!review.getUser().equals(user)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not authorized to update this review");
        }

        // 5. 리뷰 수정
        review.setComment(reviewDto.getReview()); // ReviewDto의 review로 수정
        reviewRepository.save(review); // 수정된 리뷰 저장
    }

    // 리뷰 삭제
    public void deleteReview(String token, Long reviewId) {
        String bearerToken = token.substring(7);

        // 1. 토큰 검증
        if (tokenProvider.isTokenExpired(bearerToken)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token has expired");
        }

        String username = tokenProvider.getUsernameFromToken(bearerToken); // 토큰에서 사용자명 추출
        Optional<User> optionalUser = userRepository.findByUsername(username);
        User user = optionalUser.orElseThrow(() -> new RuntimeException("User not found"));

        // 삭제를 원하는 리뷰 찾기
        reviewRepository.findById(reviewId)
                .filter(review -> review.getUser().equals(user))
                .ifPresentOrElse(
                        review -> reviewRepository.delete(review),
                        () -> {
                            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                                    "Review not found or you are not authorized to delete this review");
                        });

    }

    // 좋아요 누름
    public String favorite(String token, Long recipeId) {
        String bearerToken = token.substring(7);

        if (tokenProvider.isTokenExpired(bearerToken)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token has expired");
        }

        String username = tokenProvider.getUsernameFromToken(bearerToken); // 토큰에서 사용자명 추출
        User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
        Recipe recipe = recipeRepository.findById(recipeId).orElseThrow(() -> new RuntimeException("Recipe not found"));
        Favorite favorite = new Favorite();
        favorite.setRecipe(recipe);
        favorite.setUser(user);
        
        // Optional의 내용을 확인하기 위해 isPresent() 메서드를 사용
        if (favoriteRepository.findByUserAndRecipe(user, recipe).isPresent()) {
            return "Not Permission double."; // 이미 즐겨찾기 등록된 경우
        } else {
            favoriteRepository.save(favorite); // 즐겨찾기 저장
            return "Ok"; // 성공적으로 저장된 경우
        }

    }

    // 좋아요 해제
    public void favorite_cancel(String token, Long recipeId){
        String bearerToken = token.substring(7);
        if(tokenProvider.isTokenExpired(bearerToken)){
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token has expired");
        }
        String username = tokenProvider.getUsernameFromToken(bearerToken); // 토큰에서 사용자명 추출
        User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
        Recipe recipe = recipeRepository.findById(recipeId).orElseThrow(()-> new RuntimeException("Recipe not found"));
        
        
        Favorite favorite = favoriteRepository.findByUserAndRecipe(user, recipe)
        .orElseThrow(() -> new RuntimeException("Favorite not found"));

        favoriteRepository.delete(favorite); // Favorite 삭제
        
    }


    // 내가 좋아요 누른 게시물
    public List<BoardRecipeDto> RecipeUserFavorite(String token) {
        String username = tokenProvider.getUsernameFromToken(token);

        if (username == null) {
            throw new RuntimeException("Invalid token or user not authenticated");
        }

        Optional<User> optionalUser = userRepository.findByUsername(username); // User 정보 조회

        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
        
            // 사용자 ID로 필터링하여 레시피를 조회합니다.
            List<Recipe> recipes = recipeRepository.findAll().stream()
                    .filter(recipe -> recipe.getUser().getUserId().equals(user.getUserId()))
                    .collect(Collectors.toList());
        
            // 각 레시피에 대한 이미지를 미리 조회합니다.
            Map<Long, List<Image>> recipeImagesMap = imageRepository.findAll().stream()
                    .collect(Collectors.groupingBy(image -> image.getRecipe().getRecipeId()));
            Map<Long, List<Ingredient>> recipeIngredientsMap = ingredientRepository.findAll().stream()
                    .collect(Collectors.groupingBy(ingredient -> ingredient.getRecipe().getRecipeId()));
            Map<Long, List<Instruction>> recipeInstructionsMap = instructionRepository.findAll().stream()
                    .collect(Collectors.groupingBy(instruction -> instruction.getRecipe().getRecipeId()));
        
            // 레시피 DTO 리스트를 생성합니다.
            List<BoardRecipeDto> myRecipeDtos = recipes.stream()
                    .map(recipe -> {
                        // 현재 user가 좋아요를 하였는지의 여부를 확인합니다.
                        boolean userFavorite = favoriteRepository.checkUserFavorite(user.getUserId(), recipe.getRecipeId());
        
                        // userFavorite이 true일 때만 나머지 코드 실행
                        if (userFavorite) {
                            List<Image> images = recipeImagesMap.getOrDefault(recipe.getRecipeId(), Collections.emptyList());
                            List<ImageDto> imageDtos = images.stream()
                                    .map(image -> new ImageDto(image.getImageId(), image.getImageUrl()))
                                    .collect(Collectors.toList());
        
                            // cookTime
                            int cookTime = recipeRepository.cookingTime(recipe.getRecipeId());
        
                            List<Ingredient> ingredients = recipeIngredientsMap.getOrDefault(recipe.getRecipeId(), Collections.emptyList());
                            List<IngredientDto> ingredientDtos = ingredients.stream()
                                    .map(ingredient -> new IngredientDto(ingredient.getIngredient()))
                                    .collect(Collectors.toList());
        
                            List<Instruction> instructions = recipeInstructionsMap.getOrDefault(recipe.getRecipeId(), Collections.emptyList());
                            List<InstructionDto> instructionDtos = instructions.stream()
                                    .map(instruction -> new InstructionDto(instruction.getStepNumber(), instruction.getInstructionDescription()))
                                    .collect(Collectors.toList());
        
                            // 좋아요 수를 계산합니다.
                            long favoriteCount = favoriteRepository.countByRecipeId(recipe.getRecipeId());
        
                            // 댓글 수를 계산합니다.
                            long reviewCount = reviewRepository.countByRecipeId(recipe.getRecipeId());
        
                            // 현재 review 상황을 체크합니다.
                            List<CheckReviewDto> reviews = reviewRepository.checkReviewRecipeId(recipe.getRecipeId());
        
                            return new BoardRecipeDto(recipe.getRecipeId(), recipe.getTitle(), imageDtos,
                                    recipe.getRecipeDescription(), recipe.getUser().getUserId(), favoriteCount, reviewCount, userFavorite, reviews, cookTime, ingredientDtos, instructionDtos);
                        }
        
                        // userFavorite이 false일 경우, null 또는 기본 값을 반환
                        return null; // 또는 필요에 따라 다른 값을 반환
                    })
                    .filter(Objects::nonNull) // null 값을 필터링
                    .collect(Collectors.toList());
        
            return myRecipeDtos;
        } else {
            throw new RuntimeException("User not found");
        }
    }

    

}
