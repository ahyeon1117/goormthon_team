package io.goorm.backend.dto.project;

import io.goorm.backend.entity.ProjectMember;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ProjectMemberResponse {
    private String username;
    private String email;

    public static ProjectMemberResponse from(ProjectMember member) {
        return ProjectMemberResponse.builder()
            .username(member.getUser().getUsername())
            .email(member.getUser().getEmail())
            .build();
    }
}
