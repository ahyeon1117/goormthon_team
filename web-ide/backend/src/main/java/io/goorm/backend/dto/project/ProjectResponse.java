package io.goorm.backend.dto.project;

import io.goorm.backend.entity.Project;
import io.goorm.backend.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@AllArgsConstructor
public class ProjectResponse {

    private Long projectid;
    private String name;
    private Long ownerId;


    public ProjectResponse(Project project) {
        this.projectid = project.getId();
        this.name = project.getName();
        this.ownerId = project.getOwner().getId();
    }
}
