package matnam_zang.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class RestTemplateConfig {
    @Bean
    public RestTemplate restTemplate() { // RestTemplate는 Spring에서 http 요청을 처리하기위한 클래스 
        return new RestTemplate();
    }
}

