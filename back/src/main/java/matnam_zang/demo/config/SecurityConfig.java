package matnam_zang.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
        .csrf(csrf -> csrf.disable())
        .authorizeHttpRequests(auth -> auth
        .anyRequest().permitAll()
            // .requestMatchers("/api/youtube").permitAll()
            // .requestMatchers("/api/auth/register").permitAll()
            // .requestMatchers("/api/auth/login").permitAll() // 로그인도 공개
            // .anyRequest().hasRole("USER") // USER 권한이 있어야 다른 요청 허용
        );

        return http.build();
    }
}
