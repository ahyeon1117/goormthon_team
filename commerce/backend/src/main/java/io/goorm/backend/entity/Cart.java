package io.goorm.backend.entity;

import jakarta.persistence.*;
import java.util.List;
import lombok.*;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Table(name = "cart")
public class Cart {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @OneToMany(fetch = FetchType.LAZY)
  @JoinColumn(name = "cart_id") // CART_DETAIL 테이블의 CART_ID(FK)
  private List<CartDetail> cartDetails;
}
