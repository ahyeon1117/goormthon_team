package io.goorm.backend.controller;

import io.goorm.backend.dto.res.CommonRes;
import io.goorm.backend.dto.res.ProductRes;
import io.goorm.backend.service.ProductService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/product")
public class ProductController {

  @Autowired
  private ProductService productService;

  @GetMapping
  public CommonRes<List<ProductRes>> getProduct() {
    CommonRes<List<ProductRes>> res = CommonRes
      .<List<ProductRes>>builder()
      .code(400)
      .msg("ERROR")
      .data(null)
      .build();

    try {
      res.setCode(200);
      res.setMsg("SUCCESS");
      res.setData(productService.findAllProduct());
    } catch (Exception e) {
      e.printStackTrace();
    }
    return res;
  }
}
