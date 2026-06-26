# PRD 생성 메타 프롬프트 — Notion 견적서 웹 뷰어 MVP

> **사용법**: 이 파일의 프롬프트 블록 전체를 Claude Code에 붙여넣으면  
> `docs/PRD.md` 파일로 완성된 PRD가 생성됩니다.

---

## 메타 프롬프트

```
당신은 시니어 프로덕트 매니저입니다.
아래 컨텍스트를 바탕으로 MVP PRD(Product Requirements Document)를 작성하세요.
결과물은 docs/PRD.md 파일로 저장합니다.

---

## 프로젝트 컨텍스트

**제품명**: Notion 견적서 웹 뷰어

**한 줄 설명**:
사업자가 Notion에 입력한 견적서를 클라이언트가 고유 URL로 웹 열람하고 PDF로 다운받는 서비스.

**해결하는 문제**:
- 견적서를 이메일 첨부(PDF/Excel)로 보내면 버전 관리가 안 되고 수정이 번거롭다.
- Notion으로 견적서를 작성하면 공유 링크가 너무 투박하고, 브랜딩이 없다.
- 클라이언트 입장에서 모바일에서 보기 불편하고, PDF 저장도 어렵다.

**목표 사용자**:
- 1차 사용자(사업자/프리랜서): Notion으로 견적서를 작성하는 1인~소규모 사업자
- 2차 사용자(클라이언트): 견적서를 받아서 확인·저장하는 고객

**기술 스택** (기존 코드베이스 기준, 변경 금지):
- Next.js App Router (v16.2.9 이상), React 19, TypeScript strict
- Tailwind CSS 4, ShadcnUI (radix-nova 스타일), Lucide React
- TanStack Query v5 (staleTime 60s)
- Zod + React Hook Form + @hookform/resolvers
- nuqs v2 (URL 상태)
- PDF 생성: 후보 라이브러리 비교 후 1개 선택할 것 (@react-pdf/renderer vs puppeteer vs html2canvas+jspdf)
- 외부 연동: Notion API (공식 SDK: @notionhq/client)

---

## PRD 작성 지침

다음 섹션을 순서대로 작성하세요. 각 섹션 제목과 구조를 그대로 사용하세요.

### 1. 제품 개요 (Product Overview)
- 한 줄 비전
- 핵심 가치 제안 (3가지, 불릿)
- MVP 범위 내/외 표 (In Scope / Out of Scope)

### 2. 사용자 스토리 (User Stories)
아래 형식을 따르세요:
> **US-[번호]** | [페르소나] 로서, [행동]을 하고 싶다. 그래야 [가치]를 얻을 수 있다.
> - 수용 기준(Acceptance Criteria): 번호 목록

페르소나별로 그룹화:
- 사업자(Owner) — 최소 4개 스토리
- 클라이언트(Client) — 최소 3개 스토리

### 3. 기능 요구사항 (Functional Requirements)
우선순위 P0(Must Have) / P1(Should Have) / P2(Nice to Have) 로 분류.

**핵심 기능 목록 (P0)**:
- Notion 데이터베이스 연동: 사업자가 지정한 Notion DB의 견적서 행을 읽어옴
- 고유 공개 URL 생성: `/invoice/[token]` 형식, 추측 불가능한 토큰
- 견적서 웹 뷰어: 브랜딩된 레이아웃으로 견적 항목·합계·세금 표시
- PDF 다운로드: 브라우저에서 즉시 다운로드, 파일명은 `견적서_[번호]_[날짜].pdf`

각 기능에 대해 다음을 작성:
- 기능 설명
- 입력/출력
- 엣지 케이스 및 에러 처리

### 4. 데이터 모델 (Data Model)
Notion DB 스키마와 내부 데이터 구조를 모두 정의하세요.

**Notion DB 컬럼 정의** (TypeScript 인터페이스 포함):
- 견적서 번호, 제목, 발행일, 유효기간
- 발행자 정보 (회사명, 담당자, 연락처, 로고 URL)
- 수신자 정보 (클라이언트명, 담당자, 연락처)
- 견적 항목 (품목, 수량, 단가, 세율, 합계)
- 상태 (draft / sent / accepted / expired)
- 메모/특이사항

**내부 도메인 타입** (TypeScript):
```typescript
// 여기에 InvoiceItem, Invoice, InvoiceSummary 타입을 정의
```

### 5. API 설계 (API Design)
Next.js App Router Route Handler 기준으로 작성.

각 엔드포인트에 대해:
- 메서드 + 경로
- 요청 파라미터 / 바디 (Zod 스키마)
- 응답 형식 (성공 / 에러)
- 인증 방식

최소 포함 엔드포인트:
- `GET /api/invoice/[token]` — 견적서 데이터 조회
- `GET /api/invoice/[token]/pdf` — PDF 스트림 반환
- (관리용) `POST /api/admin/invoice/sync` — Notion DB 수동 동기화

### 6. 화면 설계 (UI Screens)
각 화면에 대해 ASCII 와이어프레임 + 컴포넌트 목록을 작성하세요.

**필수 화면**:

1. **견적서 뷰어 페이지** (`/invoice/[token]`)
   - 헤더: 발행사 로고 + 견적서 번호 + 상태 뱃지
   - 발행자/수신자 정보 블록
   - 항목 테이블 (TanStack Table v8 사용)
   - 합계 요약 (소계, 세금, 총액)
   - PDF 다운로드 버튼 (고정 하단 또는 우상단)
   - 푸터: 유효기간, 특이사항

2. **에러/만료 페이지**
   - 404: 잘못된 토큰
   - 410: 만료된 견적서

3. **(선택, P1) 관리자 대시보드** (`/dashboard/invoices`)
   - 견적서 목록 테이블 (상태 필터, 검색)
   - Notion 동기화 버튼

### 7. 비기능 요구사항 (Non-Functional Requirements)
- **성능**: 첫 뷰어 로딩 LCP < 2.5s (Notion API 캐시 전략 포함)
- **보안**: 토큰 엔트로피 최소 128bit, HTTPS 필수, Notion API 키 서버 전용
- **접근성**: WCAG 2.1 AA (인쇄/PDF 포함)
- **반응형**: 모바일(375px) ~ 데스크탑(1440px)
- **PDF 품질**: A4 기준, 인쇄 가능 해상도

### 8. Notion API 연동 전략
- 인증 방식: Internal Integration Token (서버 환경변수)
- 데이터 동기화 방식 선택 및 근거:
  옵션 A — 요청 시 실시간 조회 (캐싱 필수, staleTime 결정)
  옵션 B — 주기적 폴링 후 내부 DB 저장 (Vercel Cron 등)
  → 추천 방식 + 이유 명시
- Notion API Rate Limit 대응 전략 (평균 3 req/s)
- 데이터 매핑: Notion Property Type → 내부 TypeScript 타입

### 9. PDF 생성 전략
세 후보를 비교하고 MVP에 적합한 1개를 선택하세요:

| 항목 | @react-pdf/renderer | puppeteer | html2canvas + jspdf |
|------|--------------------:|----------:|--------------------:|
| 서버/클라이언트 | 서버 | 서버 | 클라이언트 |
| 스타일 방식 | StyleSheet | CSS | CSS |
| 한글 폰트 지원 | 수동 임베드 | 자동 | 자동 |
| Vercel Edge 호환 | O | X | O |
| 번들 크기 | 중 | 대 | 소 |

→ 선택 라이브러리, 선택 이유, 폰트 처리 계획 명시

### 10. 마일스톤 (Milestones)
3개 스프린트(각 1주) 기준으로 작성:

| 스프린트 | 목표 | 완료 기준(Definition of Done) |
|---------|------|-------------------------------|
| Sprint 1 | Notion 연동 + 기본 뷰어 | `/invoice/[token]` 에서 실제 Notion 데이터 렌더 |
| Sprint 2 | PDF 다운로드 + 에러 처리 | PDF 다운로드 동작, 만료/404 페이지 |
| Sprint 3 | 관리 대시보드 + 성능 | 목록·필터 동작, LCP < 2.5s 검증 |

### 11. 미결 사항 (Open Questions)
PRD 작성 중 결정이 필요한 항목을 표로 정리:

| # | 질문 | 영향 범위 | 결정 기한 |
|---|------|----------|----------|
| 1 | 견적서 수정 시 URL 유지 여부 (토큰 불변 vs 재발급) | 보안·UX | Sprint 1 전 |
| 2 | 클라이언트 수락/거절 기능 MVP 포함 여부 | 범위 | Sprint 1 전 |
| 3 | 다중 사업자(멀티테넌트) 지원 시점 | 아키텍처 | Sprint 3 후 |

---

## 출력 형식 지침

- 파일: `docs/PRD.md`
- 언어: 한국어 (기술 용어·코드는 영어 유지)
- 마크다운 테이블·코드블록 적극 활용
- TypeScript 타입 정의는 실제 컴파일 가능한 수준으로 작성
- 모호한 요구사항은 가정을 명시한 뒤 작성 ("가정: ..." 형식)
- PRD 상단에 메타데이터 블록 포함:

  ```
  ---
  제품명: Notion 견적서 웹 뷰어
  버전: 0.1.0 (MVP)
  작성일: {{오늘 날짜}}
  작성자: {{작성자명}}
  상태: Draft
  ---
  ```

작성을 시작하세요.
```

---

## 이 메타 프롬프트가 다루는 범위

| 섹션 | 설명 |
|------|------|
| 제품 개요 | 비전, 가치 제안, MVP In/Out Scope |
| 사용자 스토리 | 페르소나별 스토리 + 수용 기준 |
| 기능 요구사항 | P0/P1/P2 우선순위 분류 |
| 데이터 모델 | Notion DB 스키마 + TypeScript 타입 |
| API 설계 | Route Handler 엔드포인트 + Zod 스키마 |
| UI 화면 | 와이어프레임 + 컴포넌트 목록 |
| 비기능 요구사항 | 성능, 보안, 접근성, 반응형 |
| Notion 연동 전략 | 동기화 방식, Rate Limit 대응 |
| PDF 생성 전략 | 라이브러리 비교 분석 + 선택 |
| 마일스톤 | 3 스프린트 + DoD |
| 미결 사항 | 결정이 필요한 항목 추적 |
