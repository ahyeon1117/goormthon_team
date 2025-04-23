#!/bin/bash

echo "🔨 Gradle 빌드 시작..."

#./gradlew build || { echo "❌ 빌드 실패"; exit 1; }
if ./gradlew build -x test; then
    echo "✅ Gradle 빌드 성공"
else
    echo "❌ Gradle 빌드 실패"
    exit 1
fi

echo "🐳 Docker Compose 실행..."
docker-compose up --build -d
