package matnam_zang.demo.dto;

import lombok.Data;

// 이외에도 데이터가 더 있지만 쓸만해보이는걸로 정제
@Data
public class YouTubeDto {
    private String videoId;
    private String title;
    private String description;
    private String thumbnailUrl;
    private String channelTitle;
    private String publishedAt;

    private String thumbnailDefault;
    private String thumbnailMedium;
    private String thumbnailHigh;
}
