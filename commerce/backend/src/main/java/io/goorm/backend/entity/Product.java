package io.goorm.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;

@Data
@Entity
public class Product {

  @Id
  private String title;

  private String link;
  private String image;
  private String author;
  private String discount;
  private String publisher;
  private String pubdate;
  private String isbn;

  @Column(columnDefinition = "TEXT")
  private String description;
}
