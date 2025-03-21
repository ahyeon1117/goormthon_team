package io.goorm.backend.controller;

import io.goorm.backend.service.UserQueueService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/queue")
public class UserQueueController {

  private final UserQueueService userQueueService;

  @GetMapping("/waiting/register")
  public Long registerWaitingList(@RequestParam(name = "user_id") Long userId) {
    return userQueueService.registerWaitingList(userId);
  }

  @GetMapping("/processing/enter")
  public String enter() {
    userQueueService.enter();
    return "success";
  }

  @GetMapping("/processing/exit")
  public String exit(@RequestParam(name = "user_id") Long userId) {
    userQueueService.exit(userId);
    return "success";
  }
}
