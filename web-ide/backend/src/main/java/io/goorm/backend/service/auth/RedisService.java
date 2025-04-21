package io.goorm.backend.service.auth;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;


/**
 * Redis 서비스
 * 
 * Redis에 토큰 저장 및 삭제/조회
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

    // 값을 꺼낸 후 동시에 삭제(pop)
    public String getAndRemove(String key) {
        return redisTemplate.opsForSet().pop(key);
    }

    // 로그아웃 시 refresh token 즉시 삭제
    public void delete(String key) {
        redisTemplate.delete(key);
    }

    // accessToken을 블랙리스트에 추가
    // * 블랙리스트란?
    //   더 이상 허용하지 않을 토큰을 모아두는 리스트로, 로그아웃 후 사용자의 접근을 막는 용도
    public void addToBlacklist(String accessToken, long ttl) {
        redisTemplate.opsForValue().set(
            "blacklist:" + accessToken, // 블랙리스트에 저장할 키
            "logout",             // 블랙리스트에 저장할 값
            ttl,                        // 블랙리스트에 저장할 시간
            TimeUnit.MILLISECONDS       // 시간 단위
        );
    }

    // accessToken이 블랙리스트에 있는지 확인
    public boolean isBlacklisted(String accessToken) {
        // Redis에 해당 키가 있으면 true, 없으면 false
        return Boolean.TRUE.equals(redisTemplate.hasKey("blacklist:" + accessToken));
    }

}
