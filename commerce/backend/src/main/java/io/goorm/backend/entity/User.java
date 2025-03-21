package io.goorm.backend.entity;

import io.goorm.backend.entity.converter.AuthorityConverter;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "MEMBER")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {

  @Id
  @Column(name = "user_id", nullable = false)
  private String id;

  private String password;

  @Column(name = "nick_name", nullable = false)
  private String nickname;

  @Convert(converter = AuthorityConverter.class)
  private Authority role;

  @OneToOne(cascade = CascadeType.ALL)
  @JoinColumn(name = "cart_id")
  private Cart cart;
}
