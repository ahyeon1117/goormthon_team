package io.goorm.backend.service;

import io.goorm.backend.dto.CartItemDto;
import io.goorm.backend.dto.res.ResAddNewProductToCart;
import io.goorm.backend.dto.res.ResDeleteProductFromCart;
import io.goorm.backend.dto.res.ResGetCartItems;
import io.goorm.backend.entity.Cart;
import io.goorm.backend.entity.CartItem;
import io.goorm.backend.entity.Product;
import io.goorm.backend.entity.User;
import io.goorm.backend.repository.CartItemRepository;
import io.goorm.backend.repository.CartRepository;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;

    private final UserService userService;
    private final ProductService productService;
    private final JwtService jwtService;

    @Transactional
    public Cart createCartForUser(User user) {
        Cart cart = Cart.builder().user(user).itemsCount(0L).build();

        return cartRepository.save(cart);
    }

    @Transactional
    public ResGetCartItems getCurrentUserCartItems() {
        String userId = jwtService.getUserId();
        User user = userService.findById(userId);
        Cart cart = cartRepository.findByUser(user)
            .orElseThrow(() -> new RuntimeException("사용자의 장바구니를 찾을 수 없습니다."));

        // 장바구니 아이템 목록 가져오기
        List<CartItem> cartItems = cart.getCartItems();

        // 응답 DTO 생성 및 반환
        return ResGetCartItems.of(cartItems);
    }

    @Transactional
    public ResAddNewProductToCart addNewProductToCart(CartItemDto item) {
        String userId = jwtService.getUserId(); // 로그인한 유저만 장바구니에 물건을 담을 수 있음
        User user = userService.findById(userId);
        Product product = productService.findProductById(item.getProductId());

        // 사용자의 장바구니 조회
        Cart cart = cartRepository.findByUser(user)
            .orElseThrow(() -> new RuntimeException("사용자의 장바구니를 찾을 수 없습니다."));

        // 장바구니에 상품이 이미 있는지 확인
        Optional<CartItem> existingItem =
            cartItemRepository.findByCartAndProduct(cart, product);

        if (existingItem.isPresent()) {
            // 전자책은 이미 장바구니에 있으면 추가하지 않음
            return ResAddNewProductToCart.itemAlreadyExists();
        } else {
            // 새 상품 추가
            CartItem cartItem = CartItem.builder().product(product).build();

            cart.addCartItem(cartItem);
            cartItemRepository.save(cartItem);

            return ResAddNewProductToCart.success();
        }
    }

    @Transactional
    public ResDeleteProductFromCart deleteProductFromCart(CartItemDto item) {
        String userId = jwtService.getUserId();
        User user = userService.findById(userId);
        Product product = productService.findProductById(item.getProductId());

        // 사용자의 장바구니 조회
        Cart cart = cartRepository.findByUser(user)
            .orElseThrow(() -> new RuntimeException("사용자의 장바구니를 찾을 수 없습니다."));

        // 장바구니에 해당 상품이 있는지 확인
        Optional<CartItem> cartItemOptional = cartItemRepository.findByCartAndProduct(cart, product);

        if (cartItemOptional.isPresent()) {
            CartItem cartItem = cartItemOptional.get();
            // 장바구니에서 아이템 제거
            cart.removeCartItem(cartItem);
            // DB에서도 삭제
            cartItemRepository.delete(cartItem);
            return ResDeleteProductFromCart.success();
        } else {
            // 장바구니에 상품이 없는 경우
            return ResDeleteProductFromCart.itemNotExists();
        }
    }

    @Transactional
    public ResDeleteProductFromCart deleteProductListFromCart(List<CartItemDto> items) {
        String userId = jwtService.getUserId();
        User user = userService.findById(userId);

        // 사용자의 장바구니 조회
        Cart cart = cartRepository.findByUser(user)
            .orElseThrow(() -> new RuntimeException("사용자의 장바구니를 찾을 수 없습니다."));

        // 각 상품마다 확인
        for (CartItemDto item : items) {
            Product product = productService.findProductById(item.getProductId());
            
            // 장바구니에 해당 상품이 있는지 확인
            Optional<CartItem> cartItemOptional = cartItemRepository.findByCartAndProduct(cart, product);

            if (cartItemOptional.isPresent()) {
                CartItem cartItem = cartItemOptional.get();
                cart.removeCartItem(cartItem); // 장바구니에서 해당 상품 제거
                cartItemRepository.delete(cartItem); // DB에서도 삭제
            } else {
                // 장바구니에 상품이 없는 경우
                return ResDeleteProductFromCart.itemNotExists();
            }
        }
        return ResDeleteProductFromCart.success();
    }

    // @Transactional
    // public List<CartItem> getCartItems(String userId) {
    //     User user = userService.findById(userId);
    //     Cart cart = cartRepository.findByUser(user)
    //         .orElseThrow(() -> new RuntimeException("사용자의 장바구니를 찾을 수 없습니다."));

    //     return cart.getCartItems();
    // }

    // @Transactional
    // public void removeCartItem(String userId, Long productId) {
    //     User user = userService.findById(userId);
    //     Cart cart = cartRepository.findByUser(user)
    //         .orElseThrow(() -> new RuntimeException("사용자의 장바구니를 찾을 수 없습니다."));

    //     Product product = productService.findProductById(productId);

    //     cartItemRepository
    //         .findByCartAndProduct(cart, product)
    //         .ifPresent(cartItem -> {
    //             cart.removeCartItem(cartItem);
    //             cartItemRepository.delete(cartItem);
    //         });
    // }
}
