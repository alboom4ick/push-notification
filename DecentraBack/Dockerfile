# Stage 1: Build
FROM openjdk:21-slim as build

WORKDIR /app

# Copy the Gradle wrapper files
COPY gradlew .
COPY gradle gradle
COPY build.gradle.kts .
COPY settings.gradle.kts .

# Ensure the Gradle wrapper is executable
RUN chmod +x ./gradlew

# Install necessary dependencies for building
RUN apt-get update && apt-get install -y dos2unix && apt-get install -y curl

# Convert gradlew to Unix format (in case it is in Windows format)
RUN dos2unix ./gradlew

# Verify if gradlew is executable
RUN ls -l ./gradlew

ENV GRADLE_OPTS="-Xmx2g -XX:+HeapDumpOnOutOfMemoryError -Dfile.encoding=UTF-8"

# Copy the source code and build the application
COPY src src

# Run Gradle with more logging to identify the errors
RUN ./gradlew bootJar --info

# Stage 2: Run
FROM openjdk:21-slim

WORKDIR /app

# Copy the built jar from the build stage
COPY --from=build /app/build/libs/*.jar app.jar

# Set the entrypoint
ENTRYPOINT ["java", "-Dvertx.disableDnsResolver=true", "-Djava.net.preferIPv4Stack=true", "-Xms4g","-Xmx4g","-XX:+UseG1GC", "-jar", "app.jar"]
