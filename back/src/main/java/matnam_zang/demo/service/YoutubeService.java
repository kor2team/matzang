package matnam_zang.demo.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import matnam_zang.demo.dto.YouTubeDto;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

@Service
public class YoutubeService {
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${api.youtubeKey}")
    private String youtubeKey;

    public YoutubeService(RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

    public List<YouTubeDto> getYoutubeBySearchName(String searchName) {
        String apiUrl = String.format("https://www.googleapis.com/youtube/v3/search?key=%s&part=snippet&q=%s&type=video", youtubeKey, searchName); // API 경로
        System.out.println(apiUrl);
        String response = restTemplate.getForObject(apiUrl, String.class);
        List<YouTubeDto> videoList = new ArrayList<>();

        try {
            JsonNode rootNode = objectMapper.readTree(response);
            JsonNode items = rootNode.path("items");

            for (JsonNode itemNode : items) {
                YouTubeDto video = new YouTubeDto();
                
                video.setVideoId(itemNode.path("id").path("videoId").asText());

                JsonNode snippetNode = itemNode.path("snippet");
                video.setTitle(snippetNode.path("title").asText());
                video.setDescription(snippetNode.path("description").asText());
                video.setPublishedAt(snippetNode.path("publishedAt").asText());
                video.setChannelTitle(snippetNode.path("channelTitle").asText());

                video.setThumbnailDefault(snippetNode.path("thumbnails").path("default").path("url").asText());
                video.setThumbnailMedium(snippetNode.path("thumbnails").path("medium").path("url").asText());
                video.setThumbnailHigh(snippetNode.path("thumbnails").path("high").path("url").asText());

                videoList.add(video);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return videoList;
    }
}
