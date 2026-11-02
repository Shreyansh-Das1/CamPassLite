
# Stage 1: Build the Spring Boot application
FROM gradle:9.3.0-jdk17 AS builder
WORKDIR /app
COPY . .
RUN gradle clean bootJar -x test --no-daemon

# Stage 2: Run the application
FROM eclipse-temurin:17-jre

WORKDIR /app

COPY --from=builder /app/build/libs/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
