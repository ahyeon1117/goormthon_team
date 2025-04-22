package io.goorm.backend.dto.auth;


import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class SignUpResponse {

    private Long id;
    private String username;
    private String email;
}
