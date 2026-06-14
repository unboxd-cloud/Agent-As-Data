FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /workspace
COPY pom.xml .
COPY src ./src
RUN mvn -q -DskipTests package

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /workspace/target/agent-as-data-reconciler-0.1.0.jar /app/reconciler.jar
USER 10001
ENTRYPOINT ["java", "-jar", "/app/reconciler.jar"]
