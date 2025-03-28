package io.goorm.backend.init;

import io.goorm.backend.entity.Cart;
import io.goorm.backend.entity.CartItem;
import io.goorm.backend.entity.Product;
import io.goorm.backend.entity.User;
import io.goorm.backend.repository.CartRepository;
import io.goorm.backend.repository.ProductRepository;
import io.goorm.backend.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.DependsOn;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Component
@DependsOn({"userInit", "productInit"}) // UserInit과 ProductInit이 먼저 실행된 후 실행되도록 의존성 설정
public class CartInit {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private ProductRepository productRepository;

    @PostConstruct
    @Transactional
    public void init() {
        // goorm 계정 조회
        Optional<User> userOptional = userRepository.findById("goorm");

        if (userOptional.isPresent()) {
            User user = userOptional.get();

            // 이미 카트가 있는지 확인
            if (cartRepository.findByUser(user).isEmpty()) {
                // 카트 생성
                Cart cart = Cart.builder()
                        .user(user)
                        .itemsCount(0L)
                        .build();

                cartRepository.save(cart);

                // 21번-25번 책 추가
                List<Long> bookIds = Arrays.asList(21L, 22L, 23L, 24L, 25L);

                for (Long bookId : bookIds) {
                    Optional<Product> productOptional = productRepository.findById(bookId);

                    if (productOptional.isPresent()) {
                        Product product = productOptional.get();

                        // 카트 아이템 생성
                        CartItem cartItem = CartItem.builder()
                                .product(product)
                                .build();

                        // 카트에 추가
                        cart.addCartItem(cartItem);
                    } else {
                        System.out.println("책을 찾을 수 없습니다: ID " + bookId);
                    }
                }

                // 변경사항 저장
                cartRepository.save(cart);

                System.out.println("goorm 계정에 카트가 생성되었으며, 책 ID 21, 22가 추가되었습니다.");
            } else {
                System.out.println("goorm 계정에 이미 카트가 존재합니다.");
            }
        } else {
            System.out.println("goorm 계정을 찾을 수 없습니다.");
        }
    }
} 
