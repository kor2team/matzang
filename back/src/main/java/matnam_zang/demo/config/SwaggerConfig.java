package matnam_zang.demo.config;

import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import lombok.RequiredArgsConstructor;

@OpenAPIDefinition(info = @Info(title = "Recipe API", description = "Swagger 테스트", version = "v1"))
@RequiredArgsConstructor
@Configuration
public class SwaggerConfig {

    @Bean(name = "YouTubeOpenApi")
    public GroupedOpenApi youTubeOpenApi() {
        String[] paths = { "/api/youtube/**" }; // YouTube API 경로
        return GroupedOpenApi.builder()
                .group("YouTube API")
                .pathsToMatch(paths)
                .build();
    }

    @Bean(name = "UserOpenApi")
    public GroupedOpenApi userOpenApi() {
        String[] paths = { "/api/auth/**" }; // Recipe API 경로
        return GroupedOpenApi.builder()
                .group("User API")
                .pathsToMatch(paths)
                .build();
    }

    @Bean(name = "BoardOpenApi")
    public GroupedOpenApi boardOpenApi() {
        String[] paths = { "/api/all/**" }; // Board API 경로
        return GroupedOpenApi.builder()
                .group("Board API")
                .pathsToMatch(paths)
                .build();
    }

    @Bean(name = "RecipeOpenApi")
    public GroupedOpenApi recipeOpenApi() {
        String[] paths = { "/api/recipes/**" };
        return GroupedOpenApi.builder()
                .group("Recipe API")
                .pathsToMatch(paths)
                .build();
    }
}