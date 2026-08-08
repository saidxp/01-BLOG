#!/bin/bash

export JWT_SECRET="YouKnowTheLifeIsNotEasyIfYouWorkYouGet123456789"
export JWT_EXPIRATION=86400000

./mvnw spring-boot:run