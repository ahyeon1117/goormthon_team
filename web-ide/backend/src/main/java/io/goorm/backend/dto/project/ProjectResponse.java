package io.goorm.backend.dto.project;

import io.goorm.backend.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@AllArgsConstructor
public class ProjectResponse {

    private Long prokectid;
    private String name;
    private Long ownerId;
}
