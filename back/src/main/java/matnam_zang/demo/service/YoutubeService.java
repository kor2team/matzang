package matnam_zang.demo.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import matnam_zang.demo.dto.YouTubeDto;

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
        String response = restTemplate.getForObject( "https://www.googleapis.com/youtube/v3/search?key=" + youtubeKey + "&part=snippet&q=" + searchName + "&type=video&maxResults=3", 
        String.class);
        System.out.println("https://www.googleapis.com/youtube/v3/search?key=" + youtubeKey + "&part=snippet&q=" + searchName + "&type=video&maxResults=3");
        List<YouTubeDto> videoList = new ArrayList<>();
        System.out.println("Response입니다 : " + response);
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
            System.out.println("response : " + videoList.size());
        } catch (Exception e) {
            e.printStackTrace();
        }

        return videoList;
    }
}
