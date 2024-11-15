package matnam_zang.demo.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import matnam_zang.demo.dto.YouTubeDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@ActiveProfiles("test")  // 'test' 프로파일을 활성화
@TestPropertySource(locations = "classpath:application.properties") // 테스트에 사용할 application.properties 파일 지정
public class YoutubeServiceTest {

    @Value("${api.youtubeKey}")  // application.properties에서 youtubeKey를 읽어옴
    private String youtubeKey;

    @Mock
    private RestTemplate restTemplate;  // RestTemplate을 mock으로 설정

    @InjectMocks
    private YoutubeService youtubeService;  // 실제 YoutubeService 객체가 mock된 RestTemplate을 사용하도록 설정

    @BeforeEach
    public void setUp() {
        // Mockito 초기화
        MockitoAnnotations.openMocks(this);  
    }

    @Test
    public void testGetYoutubeBySearchName() throws Exception {
        String searchName = "test";  // 검색어 설정

        // 유튜브 API URL 구성
        String url = "https://www.googleapis.com/youtube/v3/search?key=" + youtubeKey + "&part=snippet&q=" + searchName + "&type=video&maxResults=3";

        // 유튜브 API의 mock 응답을 생성
        String jsonResponse = 
        "{"
        + "\"kind\": \"youtube#searchListResponse\","
        + "\"etag\": \"5Cbvp_FuaRjq2hTIo5FAGBHtSnY\","
        + "\"nextPageToken\": \"CAMQAA\","
        + "\"regionCode\": \"KR\","
        + "\"pageInfo\": { \"totalResults\": 1000000, \"resultsPerPage\": 3 },"
        + "\"items\": ["
        + "  {"
        + "    \"kind\": \"youtube#searchResult\","
        + "    \"etag\": \"Iy7ShZkLULOIom0khjEp_ClSrTg\","
        + "    \"id\": { \"kind\": \"youtube#video\", \"videoId\": \"12345\" },"
        + "    \"snippet\": {"
        + "      \"publishedAt\": \"2024-11-15T10:00:00Z\","
        + "      \"channelId\": \"UCyn-K7rZLXjGl7VXGweIlcA\","
        + "      \"title\": \"Test Video\","
        + "      \"description\": \"This is a test video\","
        + "      \"thumbnails\": {"
        + "        \"default\": { \"url\": \"http://example.com/default.jpg\", \"width\": 120, \"height\": 90 },"
        + "        \"medium\": { \"url\": \"http://example.com/medium.jpg\", \"width\": 320, \"height\": 180 },"
        + "        \"high\": { \"url\": \"http://example.com/high.jpg\", \"width\": 480, \"height\": 360 }"
        + "      },"
        + "      \"channelTitle\": \"Test Channel\","
        + "      \"liveBroadcastContent\": \"none\","
        + "      \"publishTime\": \"2024-11-15T10:00:00Z\""
        + "    }"
        + "  }"
        + "]"
        + "}";

        // RestTemplate의 getForObject 호출을 mock하여 위의 jsonResponse를 반환하도록 설정
        when(restTemplate.getForObject(url, String.class)).thenReturn(jsonResponse);

        // youtubeService의 메소드 호출
        List<YouTubeDto> videoList = youtubeService.getYoutubeBySearchName(searchName, youtubeKey);

        // 검증: 첫 번째 비디오의 정보가 예상한 값과 일치하는지 확인
        YouTubeDto firstVideo = videoList.get(0);

        // 예상한 값 설정 (API 응답에 맞게 설정)
        YouTubeDto expectedVideo = new YouTubeDto();
        expectedVideo.setVideoId("12345");  // 실제 유튜브 응답에서 확인한 값
        expectedVideo.setTitle("Test Video");
        expectedVideo.setDescription("This is a test video");
        expectedVideo.setPublishedAt("2024-11-15T10:00:00Z");
        expectedVideo.setChannelTitle("Test Channel");
        expectedVideo.setThumbnailDefault("http://example.com/default.jpg");
        expectedVideo.setThumbnailMedium("http://example.com/medium.jpg");
        expectedVideo.setThumbnailHigh("http://example.com/high.jpg");

        // 검증: 첫 번째 비디오의 정보가 예상한 값과 일치하는지 확인
        assertEquals(expectedVideo.getVideoId(), firstVideo.getVideoId());
        assertEquals(expectedVideo.getTitle(), firstVideo.getTitle());
        assertEquals(expectedVideo.getDescription(), firstVideo.getDescription());
        assertEquals(expectedVideo.getPublishedAt(), firstVideo.getPublishedAt());
        assertEquals(expectedVideo.getChannelTitle(), firstVideo.getChannelTitle());
        assertEquals(expectedVideo.getThumbnailDefault(), firstVideo.getThumbnailDefault());
        assertEquals(expectedVideo.getThumbnailMedium(), firstVideo.getThumbnailMedium());
        assertEquals(expectedVideo.getThumbnailHigh(), firstVideo.getThumbnailHigh());
    }
}
