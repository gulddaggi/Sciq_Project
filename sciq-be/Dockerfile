FROM eclipse-temurin:17-jdk AS build
WORKDIR /workspace/app

# Install gradle
RUN apt-get update && apt-get install -y curl unzip
RUN curl -L https://services.gradle.org/distributions/gradle-8.5-bin.zip -o gradle.zip
RUN unzip gradle.zip
RUN mv gradle-8.5 /opt/gradle
ENV PATH=$PATH:/opt/gradle/bin

COPY build.gradle settings.gradle ./
COPY src src
COPY gradle gradle

# Build project
RUN gradle bootJar --no-daemon -x test

FROM eclipse-temurin:17-jre
VOLUME /tmp
COPY --from=build /workspace/app/build/libs/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar"] 