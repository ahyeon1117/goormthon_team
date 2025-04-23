package io.goorm.backend.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j; // ✅ 로그용 import 추가
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.ExchangeFilterFunction; // ✅ 필터용 import
import reactor.core.publisher.Mono; // ✅ 리액터 import


@Configuration
@RequiredArgsConstructor
@Slf4j // ✅ log 사용하려면 꼭 필요
public class WebClientConfig {

    @Value("${fastapi.base-url}")
    private String baseUrl;

    @PostConstruct
    public void init() {
        log.info("✅ Loaded FastAPI base URL: {}", baseUrl);
        System.out.println("🔥 fastapi.base-url = " + baseUrl); // 혹시 logback 설정 안 돼 있을까봐 출력도 같이
    }

    @Bean(name = "myWebClient")
    public WebClient webClient() {
        log.info("✅ WebClient baseUrl: {}", baseUrl); // 이거 찍어봐!
        return WebClient.builder()
                .baseUrl(baseUrl)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .filter(logRequest()) // 👈 요청 로그
                .filter(logResponse()) // 👈 응답 로그
                .build();
    }

    private ExchangeFilterFunction logRequest() {
        return ExchangeFilterFunction.ofRequestProcessor(clientRequest -> {
            log.info("Request: {} {}", clientRequest.method(), clientRequest.url());
            clientRequest.headers().forEach((name, values) ->
                    values.forEach(value -> log.info("Request Header: {}={}", name, value)));
            return Mono.just(clientRequest);
        });
    }

    private ExchangeFilterFunction logResponse() {
        return ExchangeFilterFunction.ofResponseProcessor(clientResponse -> {
            log.info("Response Status: {}", clientResponse.statusCode());
            return Mono.just(clientResponse);
        });
    }

    @Bean
    public ObjectMapper objectMapper() {
        return new ObjectMapper();
    }
}
