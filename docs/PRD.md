# Notion 견적서 웹 뷰어 MVP PRD

> 버전: v0.2.0 | 작성일: 2026-06-26 | 작성자: 솔로 개발자 (kikjs75@gmail.com)

---

## 핵심 정보

**목적**: Notion에서 관리하는 견적서를 클라이언트가 고유 URL 하나로 조회하고 PDF로 저장할 수 있게 한다

**사용자**: 견적서를 발행하는 1인 사업자(관리자)와 견적서 링크를 전달받는 클라이언트(고객)

---

## 사용자 정의

| 구분 | 역할 | 사용 환경 |
|------|------|----------|
| **관리자** (사업자) | Notion 데이터베이스에 견적서 작성 및 URL 공유 | Notion 앱/웹 |
| **클라이언트** (고객) | 공유 URL로 견적서 조회 및 PDF 다운로드 | 웹 브라우저 |

> 관리자는 별도 웹 어드민 없이 Notion에서 직접 모든 작업을 수행한다. 웹 앱은 클라이언트 전용이다.

---

## 사용자 여정

### 관리자 여정 (Notion 작업)

```
1. Notion 데이터베이스 열기
   ↓ 새 페이지 생성
2. 견적서 프로퍼티 입력
   (견적번호, 클라이언트명, 발행일, 유효기간, 슬러그 등)
   ↓ 페이지 본문에 품목 테이블 작성
3. 공개여부 체크박스 활성화
   ↓ 슬러그 확인 (예: project-abc-2024)
4. URL 생성 및 클라이언트에게 공유
   https://domain.com/invoice/project-abc-2024
```

### 클라이언트 여정 (웹 앱)

```
1. 이메일/메시지에서 견적서 URL 클릭
   ↓ 브라우저에서 /invoice/[slug] 접속
2. 견적서 조회 페이지 로드
   ↓ 유효성 체크

   [슬러그 없음 / 비공개] → 오류 페이지 → (종료)
   [만료된 견적서]         → 만료 안내 페이지 → (종료)
   [정상 견적서]           → 견적서 조회 페이지
   ↓

3. 견적서 내용 확인
   (견적 정보, 품목 테이블, 합계)
   ↓ PDF 다운로드 버튼 클릭

4. PDF 저장 완료 → 브라우저에서 파일 다운로드
```

---

## 기능 명세

### 1. MVP 핵심 기능

| ID | 기능명 | 설명 | MVP 필수 이유 | 관련 페이지 |
|----|--------|------|-------------|------------|
| **F001** | Notion 견적서 조회 | 슬러그로 Notion API 호출, 견적서 데이터 파싱 | 제품의 유일한 데이터 소스 | 견적서 조회 페이지 |
| **F002** | 견적서 렌더링 | 견적 헤더, 품목 테이블, 합계를 웹 페이지로 표시 | 핵심 사용자 가치 제공 | 견적서 조회 페이지 |
| **F003** | PDF 다운로드 | 견적서를 PDF 파일로 저장 | 클라이언트 핵심 니즈 | 견적서 조회 페이지 |
| **F004** | 견적서 상태 처리 | 비공개·만료·없는 견적서 분기 처리 | 잘못된 접근 방어 | 견적서 조회 페이지, 오류 페이지 |

### 2. MVP 필수 지원 기능

| ID | 기능명 | 설명 | MVP 필수 이유 | 관련 페이지 |
|----|--------|------|-------------|------------|
| **F010** | 오류 상태 표시 | 404·만료·비공개 케이스별 안내 화면 | 클라이언트 혼란 방지 | 오류 페이지 |
| **F011** | 응답 캐싱 | ISR로 Notion API 호출 횟수 제한 | API rate limit(3 req/sec) 대응 | 견적서 조회 페이지 |

### 3. MVP 이후 기능 (제외)

- 관리자 웹 대시보드 (Notion에서 직접 관리)
- 견적서 승인/거절 기능 (클라이언트 인터랙션)
- 이메일 알림 발송
- 견적서 버전 관리
- 다국어 지원
- 견적서 템플릿 선택
- 전자서명

---

## Notion 데이터베이스 스키마

### 데이터베이스 구조

Notion에 `견적서(Invoices)` 데이터베이스를 생성하고 아래 프로퍼티를 추가한다.

| 프로퍼티명 | Notion 타입 | 필수 | 설명 |
|-----------|------------|------|------|
| `이름` (Name) | Title | 필수 | 견적번호 (예: INV-2024-001) |
| `슬러그` | Text | 필수 | URL 식별자 (영문+숫자+하이픈, 예: project-abc-2024) |
| `클라이언트명` | Text | 필수 | 수신 고객 이름 또는 회사명 |
| `클라이언트이메일` | Email | 선택 | 수신 고객 이메일 |
| `발행일` | Date | 필수 | 견적서 발행 날짜 |
| `유효기간` | Date | 필수 | 견적서 만료 날짜 (이후 접근 시 만료 처리) |
| `상태` | Select | 필수 | `초안` / `발송됨` / `확인됨` / `만료됨` |
| `통화` | Select | 필수 | `KRW` / `USD` |
| `소계` | Number | 필수 | 세금 전 금액 (Number format) |
| `세율` | Number | 선택 | 부가세율 (예: 10 → 10%) |
| `합계` | Formula | 자동 | `소계 + 소계 × 세율 / 100` |
| `공개여부` | Checkbox | 필수 | 체크 해제 시 웹에서 접근 불가 |
| `비고` | Text | 선택 | 결제 조건, 추가 안내사항 |

### 페이지 본문 구조 (품목 테이블)

각 견적서 Notion 페이지 본문에 Notion 테이블 블록으로 품목을 작성한다.

```
| 품목명 | 수량 | 단가 | 금액 |
|--------|------|------|------|
| 웹 디자인 | 1 | 500,000 | 500,000 |
| 개발 (페이지당) | 5 | 200,000 | 1,000,000 |
| 유지보수 (월) | 3 | 100,000 | 300,000 |
```

> 첫 행은 헤더(품목명, 수량, 단가, 금액)로 고정한다. 앱은 이 컬럼 순서로 파싱한다.

---

## 메뉴 구조

인증이 없는 클라이언트 전용 앱이므로 내비게이션 메뉴는 최소화한다.

```
웹 앱 페이지 구조
├── 홈 (/)
│   └── 역할: 랜딩 또는 견적서 조회 페이지로 리디렉션
├── 견적서 조회 (/invoice/[slug])
│   └── 기능: F001 (Notion 조회), F002 (렌더링), F003 (PDF), F004 (상태 처리)
└── 오류 (/invoice/error)
    └── 기능: F010 (오류 상태 표시)
```

> 헤더: 로고 + 서비스명만 표시. 내비게이션 링크 없음.

---

## 페이지별 상세 기능

### 견적서 조회 페이지

> **구현 기능:** `F001`, `F002`, `F003`, `F004`, `F011` | **인증:** 불필요 (공개 URL)

| 항목 | 내용 |
|------|------|
| **역할** | 클라이언트가 견적서를 확인하고 PDF로 저장하는 핵심 페이지 |
| **진입 경로** | 관리자가 공유한 URL 직접 접속 (`/invoice/[slug]`) |
| **사용자 행동** | 견적 내용 확인, 품목 테이블 검토, PDF 다운로드 버튼 클릭 |
| **주요 기능** | • 슬러그로 Notion API 호출 및 견적서 데이터 파싱 (F001)<br>• 견적 헤더 표시 (견적번호, 발행일, 유효기간, 클라이언트명, 상태 배지) (F002)<br>• 품목 테이블 렌더링 (품목명, 수량, 단가, 금액) (F002)<br>• 소계/세금/합계 계산 표시 (F002)<br>• 비고 섹션 표시 (F002)<br>• ISR 캐싱 적용 (revalidate: 3600) (F011)<br>• **PDF 다운로드** 버튼 (F003) |
| **다음 이동** | 비공개·없는 슬러그 → 오류 페이지, 만료된 견적서 → 만료 안내(동일 페이지 내 배너), PDF 클릭 → 브라우저 파일 저장 |

---

### 오류 페이지

> **구현 기능:** `F010` | **인증:** 불필요

| 항목 | 내용 |
|------|------|
| **역할** | 존재하지 않거나 접근 불가한 견적서에 대한 안내 |
| **진입 경로** | 슬러그 없음 / 비공개 / API 오류 시 자동 이동 |
| **사용자 행동** | 오류 메시지 확인, 관리자 문의 |
| **주요 기능** | • 오류 유형별 메시지 표시 (존재하지 않음 / 비공개 / 서버 오류) (F010)<br>• 관리자 연락처 또는 안내 문구 표시 (F010) |
| **다음 이동** | 해당 없음 (최종 페이지) |

---

### 홈 페이지

> **구현 기능:** 없음 (리디렉션 전용) | **인증:** 불필요

| 항목 | 내용 |
|------|------|
| **역할** | 직접 루트 접속 시 서비스 소개 또는 견적서 없음 안내 |
| **진입 경로** | 루트 URL(`/`) 직접 접속 |
| **사용자 행동** | 서비스 간단 소개 확인 |
| **주요 기능** | • 서비스명 및 간단한 소개 문구 표시<br>• "견적서 URL이 필요합니다" 안내 |
| **다음 이동** | 별도 이동 없음 |

---

## 기술 아키텍처

### 데이터 흐름

```
[Notion 데이터베이스]
        |
        | @notionhq/client (서버 전용, NOTION_API_KEY 사용)
        | databases.query({ filter: { property: '슬러그', text: { equals: slug } } })
        | pages.retrieve(pageId) + blocks.children.list(pageId)
        v
[Next.js 15 App Router - Server Component]
        |
        | ISR: revalidate = 3600 (1시간)
        | notionResponseToInvoice() 파싱 유틸
        v
[견적서 조회 페이지 (RSC)]
        |
        | props 전달
        v
[InvoiceViewer 컴포넌트] ← PDF 버튼은 'use client' 분리
        |
        | window.print() + @media print CSS
        v
[PDF / 인쇄 다이얼로그]
```

### Notion API 호출 전략

```
1. databases.query()
   - filter: 슬러그 프로퍼티가 slug와 일치하는 페이지 1건 조회
   - 결과 없음 → 404 처리

2. blocks.children.list(pageId)
   - 페이지 본문 블록 조회 (품목 테이블 파싱용)
   - 타입이 'table'인 블록만 추출

3. ISR 캐싱
   - fetch() 대신 unstable_cache 또는 generateStaticParams 활용
   - 견적서 업데이트 시 on-demand revalidation 고려 (MVP 이후)
```

### 환경변수

```bash
NOTION_API_KEY=secret_xxxx           # Notion Integration 시크릿
NOTION_DATABASE_ID=xxxxxxxxxxxx      # 견적서 데이터베이스 ID
```

---

## PDF 다운로드 구현 방향

### 선택: window.print() + @media print CSS

MVP에서는 브라우저 기본 인쇄 기능을 활용한다. 별도 라이브러리 불필요, 서버 부하 없음.

```css
/* globals.css 에 추가 */
@media print {
  /* 인쇄 불필요 요소 숨김 */
  header, .pdf-download-btn, .status-badge { display: none; }

  /* A4 페이지 설정 */
  @page { size: A4; margin: 20mm; }

  /* 테이블 페이지 나눔 방지 */
  table { page-break-inside: avoid; }
}
```

```tsx
// PdfDownloadButton.tsx ('use client')
'use client'
export function PdfDownloadButton() {
  return (
    <button onClick={() => window.print()} className="pdf-download-btn">
      PDF 저장
    </button>
  )
}
```

**장점**: 구현 즉시 가능, 의존성 없음, 브라우저가 PDF 변환 처리

**단점**: 사용자가 인쇄 다이얼로그에서 "PDF로 저장" 선택 필요

**MVP 이후 업그레이드**: `puppeteer` 또는 `@react-pdf/renderer`로 서버사이드 PDF 생성 및 파일 직접 다운로드

---

## 데이터 모델

### Invoice (견적서 - Notion 데이터 파싱 결과)

| 필드 | 설명 | 타입/관계 |
|------|------|----------|
| id | Notion 페이지 ID | string |
| slug | URL 슬러그 | string |
| invoiceNumber | 견적번호 | string |
| clientName | 클라이언트명 | string |
| clientEmail | 클라이언트 이메일 | string \| null |
| issuedAt | 발행일 | Date |
| expiresAt | 만료일 | Date |
| status | 상태 | 'draft' \| 'sent' \| 'confirmed' \| 'expired' |
| currency | 통화 | 'KRW' \| 'USD' |
| subtotal | 소계 | number |
| taxRate | 세율 | number |
| total | 합계 | number |
| isPublic | 공개여부 | boolean |
| note | 비고 | string \| null |
| lineItems | 품목 목록 | LineItem[] |

### LineItem (견적 품목 - Notion 테이블 블록 파싱 결과)

| 필드 | 설명 | 타입/관계 |
|------|------|----------|
| name | 품목명 | string |
| quantity | 수량 | number |
| unitPrice | 단가 | number |
| amount | 금액 (수량 × 단가) | number |

---

## 기술 스택

### 프론트엔드 프레임워크

- **Next.js 15** (App Router) - RSC 우선, ISR 캐싱 활용
- **React 19** - UI 라이브러리
- **TypeScript 5.6+** - strict 모드

### 스타일링 & UI

- **TailwindCSS v4** - 인쇄용 `@media print` 스타일 포함
- **shadcn/ui** (radix-nova) - Badge, Table, Button 컴포넌트
- **Lucide React** - 아이콘

### Notion 연동

- **@notionhq/client** - 공식 Notion SDK (서버 전용)

### 데이터 페칭

- **Next.js 내장 캐싱** (`unstable_cache` / ISR revalidate) - Notion API rate limit 대응

### 배포

- **Vercel** - Next.js 최적화, 환경변수 관리

### 패키지 관리

- **npm** - 의존성 관리

---

## MVP 외 범위 (Out of Scope)

| 항목 | 제외 이유 |
|------|----------|
| 관리자 웹 대시보드 | Notion이 이미 훌륭한 어드민 UI 제공 |
| 클라이언트 인증/로그인 | URL 공유 방식으로 충분, 복잡도 증가 |
| 견적서 승인/거절 버튼 | 이메일 또는 직접 소통으로 처리 |
| 이메일 자동 발송 | MVP 범위 초과 |
| 다중 견적서 템플릿 | 하나의 Notion 페이지 구조로 통일 |
| 실시간 업데이트 | ISR로 충분, Notion Webhook 불필요 |
| 서버사이드 PDF 생성 | window.print()으로 MVP 충족 |
| 전자서명 | MVP 이후 기능 |

---

## 보안 및 성능 메모

**보안**
- `NOTION_API_KEY`는 서버 전용 (`process.env` 직접, `NEXT_PUBLIC_` 접두사 절대 사용 금지)
- Notion API 호출은 Server Component 또는 Route Handler에서만 수행
- 슬러그는 추측 방지를 위해 충분히 고유하게 설정 (예: `company-project-2024-xxxx`)

**성능**
- ISR `revalidate: 3600` 으로 동일 견적서 반복 요청 시 캐시 응답
- `generateStaticParams`로 자주 조회되는 견적서 빌드 타임 사전 생성 가능 (선택)
- Notion 블록 파싱은 최상위 블록만 조회 (depth 1), 중첩 블록 재귀 조회 금지

---

## 구현 우선순위

| 순서 | 작업 | 관련 기능 |
|------|------|----------|
| 1 | Notion 데이터베이스 생성 및 샘플 견적서 입력 | - |
| 2 | `@notionhq/client` 설치, 환경변수 설정 | F001 |
| 3 | Notion 응답 → Invoice 타입 파싱 유틸 작성 | F001 |
| 4 | `/invoice/[slug]` 페이지 서버 컴포넌트 구현 | F001, F004 |
| 5 | InvoiceViewer 컴포넌트 (견적 헤더 + 품목 테이블 + 합계) | F002 |
| 6 | PDF 인쇄 CSS + PdfDownloadButton 클라이언트 컴포넌트 | F003 |
| 7 | 오류 페이지 처리 (없음 / 비공개 / 만료) | F010 |
| 8 | ISR 캐싱 적용 | F011 |
| 9 | Vercel 배포 및 환경변수 설정 | - |
