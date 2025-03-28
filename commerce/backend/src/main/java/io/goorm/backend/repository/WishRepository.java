package io.goorm.backend.repository;

import io.goorm.backend.entity.Product;
import io.goorm.backend.entity.User;
import io.goorm.backend.entity.Wish;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface WishRepository extends CrudRepository<Wish, Long> {
    List<Wish> findByUser(User user);
    Optional<Wish> findByUserAndProduct(User user, Product product);
    // Product는 지연 로딩(LAZY)되어 실제 접근 시점에 로드됨

    @Query("SELECT w FROM Wish w JOIN FETCH w.product WHERE w.user = :user")
    List<Wish> findByUserWithProduct(@Param("user") User user);
    // @Query 어노테이션으로 직접 JPQL 작성
    // JOIN FETCH를 사용하여 Wish와 Product를 한 번의 쿼리로 함께 로드
    // 사용자의 모든 찜 목록을 조회하고 관련 Product도 즉시 로드
    // 트랜잭션이 종료된 후에도 Product 객체에 안전하게 접근 가능
    // N+1 문제를 방지하여 성능 최적화
}
