package matnam_zang.demo.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.security.Keys;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class TokenProvider {

    @Value("${api.hashKey}")
    private String hashKey;
    private static final long EXPIRATION_TIME = 86400000; // 24시간 (밀리초 단위)

    // 비밀 키를 Key 객체로 변환
    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(hashKey.getBytes());  // SecretKey를 Key 객체로 변환
    }

    // JWT 토큰 생성
    public String createToken(String username) {
        Claims claims = Jwts.claims().setSubject(username);  // 사용자명을 주제로 설정
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + EXPIRATION_TIME);

        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(getSigningKey(), SignatureAlgorithm.HS512)  // Key 객체를 사용하여 서명
                .compact();
    }

    // JWT 토큰에서 사용자 이름 가져오기
    public String getUsernameFromToken(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(getSigningKey())  // Key 객체로 서명 검증
                .build()
                .parseClaimsJws(token)
                .getBody();
        return claims.getSubject();
    }

    // JWT 토큰이 만료되었는지 확인
    public boolean isTokenExpired(String token) {
        Date expiration = Jwts.parserBuilder()
                .setSigningKey(getSigningKey())  // Key 객체로 서명 검증
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getExpiration();
        return expiration.before(new Date());
    }

    // JWT 토큰 검증
    public boolean validateToken(String token) {
        return !isTokenExpired(token);
    }
}
