FROM openjdk:17-jdk

WORKDIR /app

# Gradle이 빌드한 JAR 파일 복사
COPY build/libs/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
