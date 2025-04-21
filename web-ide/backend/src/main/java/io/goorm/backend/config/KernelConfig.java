package io.goorm.backend.config;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
@Getter
public class KernelConfig {
    @Value("${kernel.gateway.url}")
    private String gatewayUrl;

    @Value("${kernel.gateway.token}")
    private String gatewayToken;

    public static class Messages {
        public static final String KERNEL_CREATION_FAILED = "Kernel creation failed: %s";
        public static final String INTERNAL_SERVER_ERROR = "Error creating kernel: %s";
    }
} 