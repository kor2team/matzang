package matnam_zang.demo.service;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.mockito.Mockito.when;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import org.springframework.web.client.RestTemplate;

import matnam_zang.demo.dto.YouTubeDto;

@ActiveProfiles("test")
@SpringBootTest
@TestPropertySource(locations = "classpath:application.properties")
public class YoutubeServiceTest {

    @MockBean
    private RestTemplate restTemplate;

    
    @Autowired
    private YoutubeService youtubeService;

    @Value("${api.youtubeKey}")
    private String youtubeKey; // 테스트용 API 키
    

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testGetYoutubeBySearchName() throws Exception {
        String searchName = "test";
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

        when(restTemplate.getForObject(
                "https://www.googleapis.com/youtube/v3/search?key=" + youtubeKey + "&part=snippet&q=" + searchName + "&type=video&maxResults=3", 
                String.class))
                .thenReturn(jsonResponse);

        // expectedVideo의 필드를 아래처럼 맞춰줍니다.
        YouTubeDto expectedVideo = new YouTubeDto();
        expectedVideo.setVideoId("12345");
        expectedVideo.setTitle("Test Video");
        expectedVideo.setDescription("This is a test video");
        expectedVideo.setPublishedAt("2024-11-15T10:00:00Z");
        expectedVideo.setChannelTitle("Test Channel");
        expectedVideo.setThumbnailDefault("http://example.com/default.jpg");
        expectedVideo.setThumbnailMedium("http://example.com/medium.jpg");
        expectedVideo.setThumbnailHigh("http://example.com/high.jpg");
        
        // youtubeService가 정상적으로 videoList를 리턴하도록 처리합니다.
        List<YouTubeDto> videoList = youtubeService.getYoutubeBySearchName(searchName);
        
        // 결과 비교
        assertEquals(1, videoList.size());
        assertEquals(expectedVideo.getVideoId(), videoList.get(0).getVideoId());
        assertEquals(expectedVideo.getTitle(), videoList.get(0).getTitle());
        assertEquals(expectedVideo.getDescription(), videoList.get(0).getDescription());
        assertEquals(expectedVideo.getPublishedAt(), videoList.get(0).getPublishedAt());
        assertEquals(expectedVideo.getChannelTitle(), videoList.get(0).getChannelTitle());
        assertEquals(expectedVideo.getThumbnailDefault(), videoList.get(0).getThumbnailDefault());
        assertEquals(expectedVideo.getThumbnailMedium(), videoList.get(0).getThumbnailMedium());
        assertEquals(expectedVideo.getThumbnailHigh(), videoList.get(0).getThumbnailHigh());
    }
}
