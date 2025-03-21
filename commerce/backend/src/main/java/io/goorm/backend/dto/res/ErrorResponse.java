package io.goorm.backend.dto.res;

import lombok.*;

@Getter
@RequiredArgsConstructor
public class ErrorResponse {

  private final int code;
  private final String error;
  private final String requestPath;
  private final String requestMessage;

  public static ErrorResponse of(
    int code,
    String error,
    String requestPath,
    String requestMessage
  ) {
    return new ErrorResponse(code, error, requestPath, requestMessage);
  }
}
