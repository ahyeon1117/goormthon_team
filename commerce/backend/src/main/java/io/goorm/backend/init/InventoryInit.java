package io.goorm.backend.init;

import io.goorm.backend.entity.Inventory;
import io.goorm.backend.entity.InventoryItem;
import io.goorm.backend.entity.Product;
import io.goorm.backend.entity.User;
import io.goorm.backend.repository.InventoryRepository;
import io.goorm.backend.repository.ProductRepository;
import io.goorm.backend.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.DependsOn;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Component
@DependsOn({"userInit", "productInit"}) // UserInit과 ProductInit이 먼저 실행된 후 실행되도록 의존성 설정
public class InventoryInit {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private ProductRepository productRepository;

    @PostConstruct
    @Transactional
    public void init() {
        // goorm 계정 조회
        Optional<User> userOptional = userRepository.findById("goorm");

        if (userOptional.isPresent()) {
            User user = userOptional.get();

            // 이미 인벤토리가 있는지 확인
            if (inventoryRepository.findByUser(user).isEmpty()) {
                // 인벤토리 생성
                Inventory inventory = Inventory.builder()
                        .user(user)
                        .itemsCount(0L)
                        .build();

                inventoryRepository.save(inventory);

                // 11번, 12번 책 추가
                List<Long> bookIds = Arrays.asList(11L, 12L);

                for (Long bookId : bookIds) {
                    Optional<Product> productOptional = productRepository.findById(bookId);

                    if (productOptional.isPresent()) {
                        Product product = productOptional.get();

                        // 인벤토리 아이템 생성
                        InventoryItem inventoryItem = InventoryItem.builder()
                                .product(product)
                                .lastAccessed(LocalDateTime.now())
                                .build();

                        // 인벤토리에 추가
                        inventory.addInventoryItem(inventoryItem);
                    } else {
                        System.out.println("책을 찾을 수 없습니다: ID " + bookId);
                    }
                }

                // 변경사항 저장
                inventoryRepository.save(inventory);

                System.out.println("goorm 계정에 인벤토리가 생성되었으며, 책 ID 11, 12가 추가되었습니다.");
            } else {
                System.out.println("goorm 계정에 이미 인벤토리가 존재합니다.");
            }
        } else {
            System.out.println("goorm 계정을 찾을 수 없습니다.");
        }
    }
}
