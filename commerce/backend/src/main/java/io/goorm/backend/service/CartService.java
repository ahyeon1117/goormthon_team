package io.goorm.backend.service;

import io.goorm.backend.dto.CartItemDto;
import io.goorm.backend.dto.res.ResAddNewProductToCart;
import io.goorm.backend.entity.Cart;
import io.goorm.backend.entity.CartItem;
import io.goorm.backend.entity.Product;
import io.goorm.backend.entity.User;
import io.goorm.backend.repository.CartItemRepository;
import io.goorm.backend.repository.CartRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CartService {

  private final CartRepository cartRepository;
  private final CartItemRepository cartItemRepository;

  private final UserService userService;
  private final ProductService productService;
  private final JwtService jwtService;

  @Transactional
  public Cart makeCart(User user) {
    Cart cart = Cart.builder()
        .user(user)
        .itemsCount(0L)
        .build();

    return cartRepository.save(cart);
  }

  public Cart getCart(User user) {
    Optional<Cart> cartOptional = cartRepository.findByUser(user);

    // 장바구니가 없는 경우 새로 생성
    return cartOptional.orElseGet(() -> makeCart(user));
  }

  @Transactional
  public ResAddNewProductToCart addNewProductToCart(CartItemDto item) {
    String userId = jwtService.getUserId(); // 로그인한 유저만 장바구니에 물건을 담을 수 있음
    User user = userService.findById(userId);
    Product product = productService.findProductById(item.getProductId());

    // 사용자의 장바구니 조회 또는 생성
    Cart cart = getCart(user);

    // 장바구니에 상품이 이미 있는지 확인
    Optional<CartItem> existingItem = cartItemRepository.findByCartAndProduct(cart, product);

    if (existingItem.isPresent()) {
      // 전자책은 이미 장바구니에 있으면 추가하지 않음
      return ResAddNewProductToCart.builder().result("item already exists").build();
    } else {
      // 새 상품 추가
      CartItem cartItem = CartItem.builder()
          .product(product)
          .build();

      cart.addCartItem(cartItem);
      cartItemRepository.save(cartItem);

      return ResAddNewProductToCart.builder().result("success").build();
    }
  }

  public List<CartItem> getCartItems(String userId) {
    User user = userService.findById(userId);
    Cart cart = getCart(user);
    return cart.getCartItems();
  }

  @Transactional
  public void removeCartItem(String userId, String productId) {
    User user = userService.findById(userId);
    Cart cart = getCart(user);
    Product product = productService.findProductById(productId);

    cartItemRepository.findByCartAndProduct(cart, product)
        .ifPresent(cartItem -> {
          cart.removeCartItem(cartItem);
          cartItemRepository.delete(cartItem);
        });
  }
}
