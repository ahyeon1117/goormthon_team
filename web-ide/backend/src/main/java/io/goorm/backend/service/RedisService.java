package io.goorm.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;


/**
 * Redis 서비스
 */
@Service
@RequiredArgsConstructor
public class RedisService {
    // Spring Data Redis에서 제공하는 RedisTemplate (Redis에 데이터를 저장하고 가져오는 기능을 제공)
    private final RedisTemplate<String, String> redisTemplate;

    // Redis에 토큰 저장 (key: accessToken, value: refreshToken)
    public Long add(String key, String value) {
        return redisTemplate.opsForSet().add(key, value);
    }

    // Redis에서 토큰 조회 (key: accessToken)
    public String getValue(String key) {
        return redisTemplate.opsForSet().pop(key);
    }
}
