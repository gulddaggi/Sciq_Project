#!/bin/bash

# 환경 변수 파일이 있다면 로드합니다.
if [ -f .env ]; then
  export $(cat .env | grep -v '#' | xargs)
fi

echo "==== SciQ Backend Deployment ===="

# 기존 Docker 인스턴스 중지 및 삭제
echo "Stopping existing containers..."
docker-compose down

# 새 이미지 빌드
echo "Building new Docker image..."
docker-compose build

# 도커 컨테이너 실행
echo "Starting containers..."
docker-compose up -d

echo "==== Deployment Complete ===="
echo "Backend is running at http://api.sciq.co.kr" 