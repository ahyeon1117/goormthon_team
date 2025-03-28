package io.goorm.backend.service;

import io.goorm.backend.dto.WishItemDto;
import io.goorm.backend.dto.res.ResAddWishItem;
import io.goorm.backend.dto.res.ResDeleteWishItem;
import io.goorm.backend.dto.res.ResGetWishItems;
import io.goorm.backend.entity.Product;
import io.goorm.backend.entity.User;
import io.goorm.backend.entity.Wish;
import io.goorm.backend.repository.WishRepository;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class WishService {

    private final WishRepository wishRepository;
    private final UserService userService;
    private final ProductService productService;
    private final JwtService jwtService;

    @Transactional
    public ResGetWishItems getCurrentUserWishItems() {
        String userId = jwtService.getUserId();
        User user = userService.findById(userId);

        // JOIN FETCH를 사용하는 메서드로 변경
        List<Wish> wishes = wishRepository.findByUserWithProduct(user);

        return ResGetWishItems.of(wishes);
    }

    @Transactional
    public ResAddWishItem addWishItem(WishItemDto item) {
        String userId = jwtService.getUserId();
        User user = userService.findById(userId);
        Product product = productService.findProductById(item.getProductId());

        // 이미 찜 목록에 있는지 확인
        Optional<Wish> existingWish = wishRepository.findByUserAndProduct(user, product);

        if (existingWish.isPresent()) {
            // 이미 찜 목록에 있으면 추가하지 않음
            return ResAddWishItem.itemAlreadyExists();
        } else {
            // 새로운 찜 항목 추가
            Wish wish = Wish.builder()
                    .user(user)
                    .product(product)
                    .build();

            wishRepository.save(wish);

            return ResAddWishItem.success();
        }
    }

    @Transactional
    public ResDeleteWishItem deleteWishItem(WishItemDto item) {
        String userId = jwtService.getUserId();
        User user = userService.findById(userId);
        Product product = productService.findProductById(item.getProductId());

        // 찜 목록에 해당 상품이 있는지 확인
        Optional<Wish> wishOptional = wishRepository.findByUserAndProduct(user, product);

        if (wishOptional.isPresent()) {
            // 찜 목록에서 상품 제거
            wishRepository.delete(wishOptional.get());
            return ResDeleteWishItem.success();
        } else {
            // 찜 목록에 상품이 없는 경우
            return ResDeleteWishItem.itemNotExists();
        }
    }
}
