package com.blog.backend;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloControler {
    // <<===>>> \\ (!!) .. 
    @GetMapping("/Hello") 
    public String hello() { 
        System.out.println("Hello from backend");
        return "Hello, backend is working! ";
    }
    // <<==>> \\  <<==>> \\ (!). (!!)
}