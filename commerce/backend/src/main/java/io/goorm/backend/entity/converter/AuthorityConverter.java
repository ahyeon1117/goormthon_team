package io.goorm.backend.entity.converter;

import io.goorm.backend.entity.Authority;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class AuthorityConverter
  implements AttributeConverter<Authority, Integer> {

  @Override
  public Integer convertToDatabaseColumn(Authority authority) {
    return authority.getGrade();
  }

  @Override
  public Authority convertToEntityAttribute(Integer integer) {
    return Authority.valueOf(integer);
  }
}
