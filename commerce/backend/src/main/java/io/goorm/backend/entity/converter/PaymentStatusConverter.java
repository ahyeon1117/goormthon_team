package io.goorm.backend.entity.converter;

import io.goorm.backend.entity.PaymentStatus;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class PaymentStatusConverter
    implements AttributeConverter<PaymentStatus, Integer> {

    @Override
    public Integer convertToDatabaseColumn(PaymentStatus paymentStatus) {
        return paymentStatus.getValue();
    }

    @Override
    public PaymentStatus convertToEntityAttribute(Integer integer) {
        return PaymentStatus.valueOf(integer);
    }
}
