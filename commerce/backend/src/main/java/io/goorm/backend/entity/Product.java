package io.goorm.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
public class Product {

  @Id
  private String title;

  @Column(nullable = false)
  private String link;

  @Column(nullable = false)
  private String image;

  @Column(nullable = false)
  private String author;

  @Column(nullable = false)
  private Double discount;

  @Column(nullable = false)
  private String publisher;

  @Column(nullable = false)
  private String pubdate;

  @Column(nullable = false)
  private String isbn;

  @Column
  private String description;

  @OneToOne(mappedBy = "product", cascade = CascadeType.ALL)
  private Inventory inventory;

  @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
  private List<CartItem> cartItems = new ArrayList<>();

  @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
  private List<OrderItem> orderItems = new ArrayList<>();

  @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
  private List<Review> reviews = new ArrayList<>();
}
