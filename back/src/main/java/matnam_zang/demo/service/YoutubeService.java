package matnam_zang.demo.service;

import matnam_zang.demo.dto.YouTubeDto;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.ArrayList;
import java.util.List;

@Service
public class YoutubeService {

    private final RestTemplate restTemplate;

    public YoutubeService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public List<YouTubeDto> getYoutubeBySearchName(String searchName, String youtubeKey) {
        String url = "https://www.googleapis.com/youtube/v3/search?key=" + youtubeKey + "&part=snippet&q=" + searchName + "&type=video&maxResults=3";

        // YouTube API 호출
        String response = restTemplate.getForObject(url, String.class);

        // 응답 JSON 파싱 후 YouTubeDto 리스트로 변환
        List<YouTubeDto> videoList = new ArrayList<>();
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode rootNode = objectMapper.readTree(response);

            for (JsonNode itemNode : rootNode.path("items")) {
                YouTubeDto video = new YouTubeDto();
                video.setVideoId(itemNode.path("id").path("videoId").asText());
                video.setTitle(itemNode.path("snippet").path("title").asText());
                video.setDescription(itemNode.path("snippet").path("description").asText());
                video.setPublishedAt(itemNode.path("snippet").path("publishedAt").asText());
                video.setChannelTitle(itemNode.path("snippet").path("channelTitle").asText());

                // Thumbnail URLs
                video.setThumbnailDefault(itemNode.path("snippet").path("thumbnails").path("default").path("url").asText());
                video.setThumbnailMedium(itemNode.path("snippet").path("thumbnails").path("medium").path("url").asText());
                video.setThumbnailHigh(itemNode.path("snippet").path("thumbnails").path("high").path("url").asText());

                videoList.add(video);
            }
        } catch (Exception e) {
            e.printStackTrace(); // 예외 처리
        }

        return videoList;
    }
}
