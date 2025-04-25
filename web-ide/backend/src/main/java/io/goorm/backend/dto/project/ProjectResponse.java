package io.goorm.backend.dto.project;

import io.goorm.backend.entity.Project;
import io.goorm.backend.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.actuate.autoconfigure.metrics.export.stackdriver.StackdriverPropertiesConfigAdapter;

@Getter
@AllArgsConstructor
public class ProjectResponse {

    private Long projectId;
    private String name;
    private Long ownerId;
    private String userName;


    public ProjectResponse(Project project) {
        this.projectId = project.getId();
        this.name = project.getName();
        this.ownerId = project.getOwner().getId();
        this.userName  = project.getOwner().getUsername();
    }

}
