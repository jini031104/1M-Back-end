# 개요

회원가입 및 로그인 기능 구현

## 기술 스택

- Node.js
- MySQL
- AWS RDS
- PM2
- Jest (유닛 테스트)
- GitHub & GitHub Action

---

## API 명세서

Swagger 사용

http://54.180.146.193:3000/api-docs/


## 프로젝트 실행
1. 의존성 설치
```
npm ci
```

2. DB
```
npx prisma generate
```

3. 실행
```
npm run dev
```

4. 유닛 테스트
```
npm run test
```