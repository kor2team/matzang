package matnam_zang.demo.repository;

import org.springframework.stereotype.Repository;
import org.springframework.web.client.RestTemplate;

@Repository
public class YoutubeRepository { // 레파지토리 이용하는경우는 db연동으로 저장할때에만
    public YoutubeRepository(RestTemplate restTemplate) {
    }
}


