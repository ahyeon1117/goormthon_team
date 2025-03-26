package io.goorm.backend.init;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.goorm.backend.entity.Product;
import io.goorm.backend.repository.ProductRepository;
import jakarta.annotation.PostConstruct;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

@Component
public class ProductInit {

    // URL에 포함된 %s에 쿼리 파라미터로 들어갈 값
    public static final String API_URL =
        "https://openapi.naver.com/v1/search/book.json?query=개발자&display=40&sort=date";

    public static final String clientId = "Ar1KFUvH4KRs83nfZhHo";
    public static final String clientSecret = "PjmHMqEa1w";

    @Autowired
    private ProductRepository repository;

    @PostConstruct
    public void init() throws JsonMappingException, JsonProcessingException {
        ObjectMapper mapper = new ObjectMapper();
        String url = String.format(API_URL);

        WebClient webClient = WebClient.builder()
            .baseUrl(url)
            .defaultHeader("X-Naver-Client-Id", clientId)
            .defaultHeader("X-Naver-Client-Secret", clientSecret)
            .build();

        ResponseEntity<String> response = webClient
            .get()
            .retrieve()
            .toEntity(String.class)
            .block();

        JsonNode root = mapper.readTree(response.getBody());
        // JSON 객체 내의 배열 필드를 추출 (여기서는 "products" 필드라고 가정)
        JsonNode productsNode = root.path("items");
        List<Product> products = mapper.readValue(
            productsNode.toString(),
            new TypeReference<List<Product>>() {}
        );
        repository.saveAll(products);
        System.out.println("Status Code: " + response.getStatusCode());
        System.out.println("Headers: " + response.getHeaders());
        System.out.println("Body: " + response.getBody());
    }
}
