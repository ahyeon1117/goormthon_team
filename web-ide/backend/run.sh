#!/bin/bash

echo "🔨 Gradle 빌드 시작..."

./gradlew build || { echo "❌ 빌드 실패"; exit 1; }

echo "🐳 Docker Compose 실행..."
docker-compose up --build -d
