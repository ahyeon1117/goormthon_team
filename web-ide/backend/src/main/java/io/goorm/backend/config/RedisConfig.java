package io.goorm.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.StringRedisSerializer;

/**
 * Redis 설정
 * Redis 연결 설정, RedisTemplate 설정
 */
@Configuration
public class RedisConfig {

    // application.yml에 정의된 Redis host를 주입
    @Value("${spring.data.redis.host}")
    private String host;

    // application.yml에 정의된 Redis port를 주입
    @Value("${spring.data.redis.port}")
    private int port;

    // Redis 연결 설정
    @Bean
    public RedisConnectionFactory redisConnectionFactory() {
        return new LettuceConnectionFactory(host, port);
    }

    // RedisTemplate 설정 (Redis에 데이터를 저장하고 가져오는 기능을 제공)
    @Bean
    public RedisTemplate<String, Object> redisTemplate() {
        RedisTemplate<String, Object> redisTemplate = new RedisTemplate<>();
        redisTemplate.setConnectionFactory(redisConnectionFactory());

        // [시리얼라이저 설정]
        // : Redis는 기본적으로 바이트 배열(byte[]) 형태로 데이터를 주고받기 때문에 Java 객체를 저장하려면 직렬화가 필요

        // 일반적인 key:value의 경우 시리얼라이저
        redisTemplate.setKeySerializer(new StringRedisSerializer()); // Redis의 Key를 UTF-8 인코딩 문자열로 직렬화
        redisTemplate.setValueSerializer(new StringRedisSerializer()); // 일반적인 Key-Value 구조에서 Value 값을 문자열로 저장

        // Hash를 사용할 경우 시리얼라이저
        redisTemplate.setHashKeySerializer(new StringRedisSerializer()); // Redis의 Hash 자료구조에서 내부 Key를 문자열로 저장
        redisTemplate.setHashValueSerializer(new StringRedisSerializer()); // Hash 구조 내의 값(value)을 문자열로 저장

        // 위에서 지정하지 않은 경우에도 문자열로 직렬화
        redisTemplate.setDefaultSerializer(new StringRedisSerializer());

        return redisTemplate;
    }
}