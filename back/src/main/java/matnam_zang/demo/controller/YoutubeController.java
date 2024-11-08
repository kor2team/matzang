package matnam_zang.demo.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import matnam_zang.demo.dto.YouTubeDto;
import matnam_zang.demo.service.YoutubeService;

import java.util.List;

@RestController
@RequestMapping("/api")
public class YoutubeController {
    private final YoutubeService youtubeService;

    public YoutubeController(YoutubeService youtubeService) {
        this.youtubeService = youtubeService;
    }

    @GetMapping("/youtube/{searchName}")
    public List<YouTubeDto> getYoutubeBySearchNameMethod(@PathVariable("searchName") String searchName) {
        return youtubeService.getYoutubeBySearchName(searchName);
    }
}



