package io.goorm.backend.entity.converter;

import io.goorm.backend.entity.OrderStatus;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class OrderStatusConverter
  implements AttributeConverter<OrderStatus, Integer> {

  @Override
  public Integer convertToDatabaseColumn(OrderStatus orderStatus) {
    return orderStatus.getValue();
  }

  @Override
  public OrderStatus convertToEntityAttribute(Integer integer) {
    return OrderStatus.valueOf(integer);
  }
}
