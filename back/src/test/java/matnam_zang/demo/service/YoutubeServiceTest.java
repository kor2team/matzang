package matnam_zang.demo.service;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.mockito.Mockito.when;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import org.springframework.web.client.RestTemplate;

import matnam_zang.demo.dto.YouTubeDto;

@ActiveProfiles("test")  // 'test' 프로파일을 활성화
@TestPropertySource(locations = "classpath:application.properties")  // 테스트에 사용할 application.properties 파일 지정
public class YoutubeServiceTest {

    @Mock
    private RestTemplate restTemplate;  // RestTemplate을 mock으로 설정

    @InjectMocks
    private YoutubeService youtubeService;  // 실제 YoutubeService 객체가 mock된 RestTemplate을 사용하도록 설정

    @Value("${api.youtubeKey}")  // application.properties에서 youtubeKey를 읽어옴
    private String youtubeKey;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);  // Mockito 초기화
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

        // RestTemplate의 getForObject 호출을 mock하여 위의 jsonResponse를 반환하도록 설정
        when(restTemplate.getForObject(
                "https://www.googleapis.com/youtube/v3/search?key=" + youtubeKey + "&part=snippet&q=" + searchName + "&type=video&maxResults=3", 
                String.class))
                .thenReturn(jsonResponse);

        // expectedVideo 객체에 예상 결과를 설정
        YouTubeDto expectedVideo = new YouTubeDto();
        expectedVideo.setVideoId("12345");
        expectedVideo.setTitle("Test Video");
        expectedVideo.setDescription("This is a test video");
        expectedVideo.setPublishedAt("2024-11-15T10:00:00Z");
        expectedVideo.setChannelTitle("Test Channel");
        expectedVideo.setThumbnailDefault("http://example.com/default.jpg");
        expectedVideo.setThumbnailMedium("http://example.com/medium.jpg");
        expectedVideo.setThumbnailHigh("http://example.com/high.jpg");

        // youtubeService가 실제로 videoList를 반환하는지 테스트
        List<YouTubeDto> videoList = youtubeService.getYoutubeBySearchName(searchName);
        
        // 결과 검증
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
