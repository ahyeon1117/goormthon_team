package io.goorm.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "cart_detail")
@Builder
@Getter
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class CartDetail {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "cart_id")
  private long cartId;

  @Column
  private String size;

  @Column
  private long quantity;

  @OneToOne
  @JoinColumn(name = "product_id")
  private Product products;
}
