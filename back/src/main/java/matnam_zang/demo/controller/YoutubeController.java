package matnam_zang.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import matnam_zang.demo.dto.YouTubeDto;
import matnam_zang.demo.service.YoutubeService;


@RestController
@RequestMapping("/api")
public class YoutubeController {

    @Value("${api.youtubeKey}")
    private String youtubeKey;

    private final YoutubeService youtubeService;

    public YoutubeController(YoutubeService youtubeService) {
        this.youtubeService = youtubeService;
    }

    // 유튜브 이름조회 엔드포인트
    @GetMapping("/youtube/{searchName}")
    public List<YouTubeDto> getYoutubeBySearchNameMethod(@PathVariable("searchName") String searchName) {
        return youtubeService.getYoutubeBySearchName(searchName, youtubeKey);
    }
    
}



