package io.goorm.backend.controller;

import io.goorm.backend.dto.res.ApiResponse;
import io.goorm.backend.dto.res.UserInfoResponse;
import io.goorm.backend.dto.security.UpdateNicknameDto;
import io.goorm.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;

    /**
     * 현재 로그인한 사용자의 회원 정보를 조회합니다.
     * 인증된 사용자만 접근할 수 있습니다.
     * @return 회원 정보 응답
     */
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserInfoResponse>> getCurrentUserInfo() {
        return ResponseEntity.ok(
            ApiResponse.success(userService.getUserInfo())
        );
    }

    //닉네임 변경
    @PutMapping("/me/change")
    public ResponseEntity<ApiResponse<UserInfoResponse>> updateNickname(
        @RequestBody UpdateNicknameDto updateNicknameDto) {
        UserInfoResponse updatedUserInfo = userService.updateNickname(updateNicknameDto);
        return ResponseEntity.ok(ApiResponse.success(updatedUserInfo));
    }
}
