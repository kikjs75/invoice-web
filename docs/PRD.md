---
제품명: Notion 견적서 웹 뷰어
버전: 0.1.0 (MVP)
작성일: 2026-06-26
작성자: Claude (시니어 PM 역할)
상태: Draft
---

# PRD — Notion 견적서 웹 뷰어 MVP

---

## 1. 제품 개요 (Product Overview)

### 한 줄 비전

> Notion을 작업 공간으로 쓰는 사업자가 견적서를 브랜딩된 웹 URL 하나로 클라이언트에게 전달하고, 클라이언트는 모바일에서도 깔끔하게 확인한 뒤 PDF를 즉시 저장할 수 있다.

### 핵심 가치 제안

- **버전 관리 자동화**: 견적서를 Notion에서 수정하면 URL은 바뀌지 않고 내용만 갱신된다. 이메일 재발송이 필요 없다.
- **브랜딩된 공유 경험**: 투박한 Notion 공유 링크 대신, 사업자 로고와 정보가 담긴 전용 뷰어 페이지로 클라이언트에게 전달된다.
- **원클릭 PDF 저장**: 클라이언트가 별도 도구 없이 버튼 하나로 인쇄 품질의 PDF를 즉시 다운로드한다.

### MVP 범위 표

| 구분 | 항목 |
|------|------|
| **In Scope (P0)** | Notion DB 연동 (읽기 전용) |
| | 견적서별 고유 공개 URL 생성 (`/invoice/[token]`) |
| | 반응형 견적서 웹 뷰어 (모바일·데스크탑) |
| | PDF 다운로드 (서버사이드 생성) |
| | 404 / 만료(410) 에러 페이지 |
| **In Scope (P1)** | 관리자 대시보드 (`/dashboard/invoices`) |
| | 견적서 상태 관리 (draft / sent / accepted / expired) |
| | Notion DB 수동 동기화 트리거 |
| **Out of Scope (MVP 이후)** | 클라이언트 수락/거절 기능 |
| | 이메일 발송 자동화 |
| | 결제 연동 |
| | 다중 사업자(멀티테넌트) 지원 |
| | 견적서 편집 UI (Notion이 편집 도구) |
| | 서명·전자계약 기능 |

---

## 2. 사용자 스토리 (User Stories)

### 사업자 (Owner)

> **US-01** | 사업자로서, Notion 데이터베이스를 서비스에 한 번 연동해 두고 싶다. 그래야 Notion에서 견적서를 작성하는 기존 워크플로를 유지하면서 자동으로 웹 뷰어가 생성된다.
>
> **수용 기준**:
> 1. 환경변수(`NOTION_API_KEY`, `NOTION_DATABASE_ID`)만 설정하면 추가 코드 없이 연동이 완료된다.
> 2. Notion DB에 새 행을 추가하고 동기화하면 `/invoice/[token]` URL이 생성된다.
> 3. API 키가 잘못되었을 때 명확한 오류 메시지가 서버 로그에 기록된다.

---

> **US-02** | 사업자로서, 견적서마다 추측 불가능한 고유 URL을 생성해서 클라이언트에게 공유하고 싶다. 그래야 해당 클라이언트만 견적서를 볼 수 있다.
>
> **수용 기준**:
> 1. 토큰은 128bit 이상 엔트로피를 가지며 순차 추측이 불가능하다.
> 2. URL 형식은 `/invoice/[token]` 이고 토큰은 URL-safe 문자로만 구성된다.
> 3. 동일한 Notion 페이지는 항상 동일한 토큰을 가진다 (재동기화 시 토큰 유지).

---

> **US-03** | 사업자로서, 관리자 대시보드에서 전체 견적서 목록과 각 견적서의 상태를 한눈에 확인하고 싶다. 그래야 어떤 견적서가 클라이언트에게 발송됐는지, 수락됐는지 파악할 수 있다.
>
> **수용 기준**:
> 1. `/dashboard/invoices` 에서 견적서 목록이 테이블로 표시된다.
> 2. 상태(draft / sent / accepted / expired) 필터와 키워드 검색이 동작한다.
> 3. 각 행에서 뷰어 URL 복사 버튼이 제공된다.

---

> **US-04** | 사업자로서, Notion에서 견적서를 수정한 뒤 대시보드에서 동기화 버튼을 눌러 최신 내용을 즉시 반영하고 싶다. 그래야 클라이언트가 항상 최신 견적서를 본다.
>
> **수용 기준**:
> 1. 대시보드의 "Notion 동기화" 버튼 클릭 시 Notion DB를 읽어 내부 캐시를 갱신한다.
> 2. 동기화 완료 후 성공/실패 toast 알림이 표시된다.
> 3. 동기화 중 버튼은 비활성화되고 로딩 스피너가 표시된다.

---

### 클라이언트 (Client)

> **US-05** | 클라이언트로서, 사업자에게 받은 URL을 열면 깔끔하게 디자인된 견적서를 바로 확인하고 싶다. 그래야 로그인이나 앱 설치 없이 즉시 견적 내용을 파악할 수 있다.
>
> **수용 기준**:
> 1. URL 접속 시 로그인 없이 견적서가 표시된다.
> 2. 발행자 로고, 회사 정보, 수신자 정보, 견적 항목 테이블, 합계가 모두 표시된다.
> 3. 견적서 상태 뱃지(예: "발송됨", "수락됨")가 헤더에 표시된다.
> 4. 페이지 로딩(LCP) 이 2.5초 이내다.

---

> **US-06** | 클라이언트로서, 견적서를 PDF 파일로 즉시 다운로드하고 싶다. 그래야 사내 결재나 파일 보관을 위해 별도 도구 없이 PDF를 얻을 수 있다.
>
> **수용 기준**:
> 1. "PDF 다운로드" 버튼 클릭 시 브라우저 다운로드가 시작된다.
> 2. 파일명은 `견적서_[견적서번호]_[발행일].pdf` 형식이다.
> 3. PDF는 A4 크기, 인쇄 가능 품질이며 한글이 깨지지 않는다.
> 4. 텍스트가 이미지가 아닌 벡터로 렌더되어 복사/검색이 가능하다.

---

> **US-07** | 클라이언트로서, 모바일 브라우저에서도 견적서를 편하게 읽고 싶다. 그래야 이동 중에도 견적 내용을 확인하고 담당자와 빠르게 협의할 수 있다.
>
> **수용 기준**:
> 1. 375px 이상 너비에서 견적서 내용이 가로 스크롤 없이 표시된다.
> 2. 항목 테이블은 모바일에서 카드 형식으로 전환된다.
> 3. PDF 다운로드 버튼이 모바일 하단 고정 영역에 배치된다.

---

## 3. 기능 요구사항 (Functional Requirements)

### P0 — Must Have

#### F-01. Notion 데이터베이스 연동

**기능 설명**: 환경변수로 지정된 Notion DB에서 견적서 데이터를 읽어와 내부 도메인 타입으로 변환한다.

**입력**: `NOTION_DATABASE_ID`, `NOTION_API_KEY` (환경변수)

**출력**: `Invoice[]` 타입 배열

**엣지 케이스**:
- Notion API Rate Limit 초과 → 429 응답 시 exponential backoff(최대 3회 재시도) 후 실패 처리
- Notion 페이지에 필수 필드 누락 → 해당 항목은 동기화 건너뛰고 로그 기록
- Notion API 연결 불가(네트워크 오류) → 캐시된 데이터 반환, 캐시 없으면 503 반환

---

#### F-02. 고유 공개 URL 생성

**기능 설명**: Notion 페이지 ID를 기반으로 결정론적 토큰을 생성한다. 동일 페이지는 재동기화 시에도 동일 토큰을 유지한다.

**입력**: Notion Page ID (string)

**출력**: URL-safe 토큰 (string, 128bit 이상)

**구현 방식**:
```typescript
// 가정: 결정론적 생성을 위해 HMAC-SHA256 사용
// NOTION_TOKEN_SECRET 환경변수를 키로 Notion Page ID를 해시
import { createHmac } from "crypto"

function generateInvoiceToken(notionPageId: string): string {
  return createHmac("sha256", process.env.NOTION_TOKEN_SECRET!)
    .update(notionPageId)
    .digest("base64url") // URL-safe, 43자 (256bit)
}
```

**엣지 케이스**:
- `NOTION_TOKEN_SECRET` 미설정 → 서버 시작 시 즉시 오류 발생
- 토큰 충돌 → HMAC 특성상 충돌 없음 (결정론적)

---

#### F-03. 견적서 웹 뷰어

**기능 설명**: `/invoice/[token]` 경로에서 견적서를 렌더링하는 반응형 페이지. 로그인 불필요.

**입력**: URL 토큰 (path parameter)

**출력**: 렌더된 견적서 HTML 페이지

**표시 요소**:
- 발행사 로고 + 회사명
- 견적서 번호 + 상태 뱃지
- 발행자/수신자 정보 그리드
- 견적 항목 테이블 (품목, 수량, 단가, 세율, 합계)
- 소계/세액/총액 요약
- 유효기간 + 메모

**엣지 케이스**:
- 토큰 미존재 → 404 에러 페이지
- 유효기간 초과 → 410 만료 페이지
- 로고 URL 로딩 실패 → 기본 아이콘으로 폴백
- 견적 항목 0개 → 빈 테이블 + 안내 문구 표시

---

#### F-04. PDF 다운로드

**기능 설명**: `GET /api/invoice/[token]/pdf` 호출 시 서버에서 PDF를 생성하여 바이너리 스트림으로 반환한다.

**입력**: URL 토큰

**출력**: `application/pdf` Content-Type, `Content-Disposition: attachment; filename*=UTF-8''견적서_INV-2026-001_20260626.pdf`

**엣지 케이스**:
- 토큰 미존재 → 404 JSON 응답
- PDF 생성 실패(메모리/타임아웃) → 500 JSON 응답, 클라이언트에 재시도 안내
- 한글 파일명 → RFC 5987 인코딩 (`filename*=UTF-8''...`) 적용

---

### P1 — Should Have

#### F-05. 관리자 대시보드

**기능 설명**: `/dashboard/invoices` 에서 견적서 목록 조회, 필터링, URL 복사, Notion 동기화를 제공한다.

**가정**: MVP에서 인증은 단일 사업자 대상으로 `ADMIN_PASSWORD` 환경변수 기반 Basic Auth를 사용한다. 멀티테넌트 인증은 Out of Scope.

#### F-06. 견적서 상태 관리

**기능 설명**: Notion DB의 상태 필드(Select)를 읽어 뷰어의 상태 뱃지에 반영한다. 상태 변경은 Notion에서 직접 수행.

#### F-07. 수동 동기화 트리거

**기능 설명**: `POST /api/admin/invoice/sync` 호출 시 Notion DB 전체를 읽어 캐시를 갱신한다.

---

### P2 — Nice to Have

| 기능 | 설명 |
|------|------|
| F-08. 조회 수 추적 | 클라이언트가 뷰어 URL을 열 때마다 조회 로그 기록 |
| F-09. 링크 만료 설정 | 유효기간과 별개로 사업자가 URL을 수동으로 비활성화 |
| F-10. 다크 모드 | 클라이언트 브라우저 설정 따라 뷰어 다크 모드 전환 |

---

## 4. 데이터 모델 (Data Model)

### Notion DB 스키마 정의

> **가정**: 견적 항목은 Notion DB 내 별도 관계형 테이블 없이, JSON 직렬화 문자열로 Rich Text 필드에 저장한다. 이는 MVP 복잡도를 낮추기 위한 결정이다.

| Notion 컬럼명 | Property Type | 설명 | 필수 |
|---------------|--------------|------|------|
| `견적서 제목` | title | 견적서 제목 | ✅ |
| `견적서 번호` | rich_text | `INV-2026-001` 형식 | ✅ |
| `발행일` | date | ISO 8601 날짜 | ✅ |
| `유효기간` | date | 만료일 (ISO 8601) | ✅ |
| `상태` | select | `draft` / `sent` / `accepted` / `expired` | ✅ |
| `회사명 (발행자)` | rich_text | 사업자 회사명 | ✅ |
| `담당자 (발행자)` | rich_text | 사업자 담당자명 | ✅ |
| `연락처 (발행자)` | rich_text | 전화번호 또는 이메일 | ✅ |
| `사업자 등록번호` | rich_text | 선택 | ❌ |
| `로고 URL` | url | 외부 이미지 URL | ❌ |
| `클라이언트 회사명` | rich_text | 수신자 회사명 | ✅ |
| `클라이언트 담당자` | rich_text | 수신자 담당자명 | ✅ |
| `클라이언트 연락처` | rich_text | 전화번호 또는 이메일 | ❌ |
| `견적 항목 (JSON)` | rich_text | `InvoiceItem[]`를 JSON.stringify한 문자열 | ✅ |
| `메모` | rich_text | 특이사항, 결제 조건 등 | ❌ |

### TypeScript 인터페이스

```typescript
// ─── 기본 도메인 타입 ───────────────────────────────────────

export interface InvoiceItem {
  id: string
  name: string
  description?: string
  quantity: number
  unitPrice: number     // 원 단위 정수
  taxRate: number       // 0.0 ~ 1.0 (예: 부가세 10% = 0.1)
  amount: number        // quantity * unitPrice (세전 공급가액)
}

export interface IssuerInfo {
  companyName: string
  personName: string
  contact: string       // 전화번호 또는 이메일
  businessNumber?: string
  logoUrl?: string
  address?: string
}

export interface RecipientInfo {
  companyName: string
  personName: string
  contact?: string
  address?: string
}

export interface InvoiceSummary {
  subtotal: number      // 공급가액 합계 (세전)
  taxAmount: number     // 세액 합계
  total: number         // subtotal + taxAmount
}

export type InvoiceStatus = "draft" | "sent" | "accepted" | "expired"

export interface Invoice {
  id: string            // 내부 UUID (= token)
  token: string         // 공개 URL 토큰 (HMAC-SHA256 기반)
  invoiceNumber: string // 예: "INV-2026-001"
  title: string
  issueDate: string     // "YYYY-MM-DD"
  expiryDate: string    // "YYYY-MM-DD"
  status: InvoiceStatus
  issuer: IssuerInfo
  recipient: RecipientInfo
  items: InvoiceItem[]
  summary: InvoiceSummary
  memo?: string
  notionPageId: string  // 원본 Notion 페이지 ID
  createdAt: string     // ISO 8601
  updatedAt: string     // ISO 8601
}

// ─── Notion API 응답 매핑용 타입 ────────────────────────────

export interface NotionInvoiceProperties {
  "견적서 제목": { title: Array<{ plain_text: string }> }
  "견적서 번호": { rich_text: Array<{ plain_text: string }> }
  "발행일": { date: { start: string } | null }
  "유효기간": { date: { start: string } | null }
  "상태": { select: { name: InvoiceStatus } | null }
  "회사명 (발행자)": { rich_text: Array<{ plain_text: string }> }
  "담당자 (발행자)": { rich_text: Array<{ plain_text: string }> }
  "연락처 (발행자)": { rich_text: Array<{ plain_text: string }> }
  "사업자 등록번호": { rich_text: Array<{ plain_text: string }> }
  "로고 URL": { url: string | null }
  "클라이언트 회사명": { rich_text: Array<{ plain_text: string }> }
  "클라이언트 담당자": { rich_text: Array<{ plain_text: string }> }
  "클라이언트 연락처": { rich_text: Array<{ plain_text: string }> }
  "견적 항목 (JSON)": { rich_text: Array<{ plain_text: string }> }
  "메모": { rich_text: Array<{ plain_text: string }> }
}

// ─── API 응답 래퍼 ───────────────────────────────────────────

export type ApiSuccess<T> = { success: true; data: T }
export type ApiError = {
  success: false
  error: "NOT_FOUND" | "EXPIRED" | "INTERNAL_ERROR" | "UNAUTHORIZED"
  message: string
}
export type ApiResponse<T> = ApiSuccess<T> | ApiError
```

---

## 5. API 설계 (API Design)

### 엔드포인트 목록

| 메서드 | 경로 | 인증 | 설명 |
|--------|------|------|------|
| `GET` | `/api/invoice/[token]` | 없음 (공개) | 견적서 데이터 조회 |
| `GET` | `/api/invoice/[token]/pdf` | 없음 (공개) | PDF 스트림 반환 |
| `POST` | `/api/admin/invoice/sync` | Basic Auth | Notion DB 수동 동기화 |

---

### GET `/api/invoice/[token]`

**인증**: 없음 (공개 URL)

**Zod 스키마**:
```typescript
// src/lib/schemas/invoice.ts
import { z } from "zod"

export const InvoiceTokenParamsSchema = z.object({
  token: z.string().min(1).max(64).regex(/^[A-Za-z0-9_-]+$/),
})
```

**응답 (성공 200)**:
```json
{
  "success": true,
  "data": {
    "id": "abc123...",
    "token": "abc123...",
    "invoiceNumber": "INV-2026-001",
    "title": "웹사이트 개발 견적서",
    "issueDate": "2026-06-26",
    "expiryDate": "2026-07-26",
    "status": "sent",
    "issuer": { "companyName": "OOO Corp", "personName": "홍길동", "contact": "010-1234-5678" },
    "recipient": { "companyName": "△△△ Co.", "personName": "김철수" },
    "items": [
      { "id": "1", "name": "UI 디자인", "quantity": 1, "unitPrice": 500000, "taxRate": 0.1, "amount": 500000 }
    ],
    "summary": { "subtotal": 500000, "taxAmount": 50000, "total": 550000 },
    "notionPageId": "...",
    "createdAt": "2026-06-26T00:00:00Z",
    "updatedAt": "2026-06-26T00:00:00Z"
  }
}
```

**응답 (404)**:
```json
{ "success": false, "error": "NOT_FOUND", "message": "견적서를 찾을 수 없습니다." }
```

**응답 (만료 410)**:
```json
{ "success": false, "error": "EXPIRED", "message": "유효기간이 만료된 견적서입니다." }
```

**캐싱 전략**: `Cache-Control: public, s-maxage=300, stale-while-revalidate=60`

---

### GET `/api/invoice/[token]/pdf`

**인증**: 없음 (공개 URL)

**응답 헤더 (성공 200)**:
```
Content-Type: application/pdf
Content-Disposition: attachment; filename*=UTF-8''%EA%B2%AC%EC%A0%81%EC%84%9C_INV-2026-001_20260626.pdf
Cache-Control: private, no-store
```

**응답 (에러)**:
```json
// 404
{ "success": false, "error": "NOT_FOUND", "message": "견적서를 찾을 수 없습니다." }
// 500
{ "success": false, "error": "INTERNAL_ERROR", "message": "PDF 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요." }
```

---

### POST `/api/admin/invoice/sync`

**인증**: `Authorization: Basic base64(admin:${ADMIN_PASSWORD})`

**Zod 스키마**:
```typescript
export const SyncBodySchema = z.object({
  pageIds: z.array(z.string()).optional(),  // 미지정 시 전체 DB 동기화
})
```

**응답 (성공 200)**:
```json
{
  "success": true,
  "data": {
    "synced": 12,
    "skipped": 1,
    "errors": [
      { "notionPageId": "...", "reason": "필수 필드 '견적서 번호' 누락" }
    ]
  }
}
```

**응답 (401)**:
```json
{ "success": false, "error": "UNAUTHORIZED", "message": "인증이 필요합니다." }
```

---

## 6. 화면 설계 (UI Screens)

### 화면 1: 견적서 뷰어 (`/invoice/[token]`)

**데스크탑 와이어프레임**:
```
┌──────────────────────────────────────────────────────────────────┐
│  [🏢 로고]  OOO Corp                         [발송됨 ●]          │
│             견적서 #INV-2026-001              [PDF 다운로드 ↓]   │
├────────────────────────────┬─────────────────────────────────────┤
│ ▌ 발행자                   │ ▌ 수신자                            │
│   회사명: OOO Corp         │   회사명: △△△ Co.                 │
│   담당자: 홍길동           │   담당자: 김철수                    │
│   연락처: 010-1234-5678   │   연락처: 010-9876-5432             │
│   발행일: 2026-06-26      │                                      │
│   유효기간: 2026-07-26    │                                      │
├────────────────────────────┴─────────────────────────────────────┤
│  #  │  품목                │  수량  │   단가   │  세율  │  합계  │
│─────┼──────────────────────┼────────┼──────────┼────────┼────────│
│  1  │  UI 디자인 설계      │    1   │ 500,000  │   10%  │550,000 │
│  2  │  프론트엔드 개발     │    1   │ 800,000  │   10%  │880,000 │
│  3  │  QA 테스트           │    1   │ 200,000  │   10%  │220,000 │
├─────┴──────────────────────┴────────┴──────────┴────────┴────────┤
│                                        공급가액:   1,500,000원   │
│                                        부가세(10%):  150,000원   │
│                                       ──────────────────────    │
│                                        합    계:   1,650,000원   │
├──────────────────────────────────────────────────────────────────┤
│  메모: 계약금 50% 선입금 후 작업 시작합니다.                     │
│  본 견적서는 2026년 7월 26일까지 유효합니다.                     │
└──────────────────────────────────────────────────────────────────┘
```

**모바일 와이어프레임 (375px)**:
```
┌──────────────────────────┐
│ [🏢] OOO Corp  [발송됨] │
│ #INV-2026-001            │
├──────────────────────────┤
│ ▌ 발행자                 │
│ OOO Corp / 홍길동        │
│ 010-1234-5678            │
│ 2026-06-26 발행          │
├──────────────────────────┤
│ ▌ 수신자                 │
│ △△△ Co. / 김철수       │
├──────────────────────────┤
│ ▌ 견적 항목              │
│ ┌────────────────────┐   │
│ │ UI 디자인 설계     │   │
│ │ 1개 × 500,000원   │   │
│ │         = 550,000원│   │
│ └────────────────────┘   │
│ ┌────────────────────┐   │
│ │ 프론트엔드 개발    │   │
│ │ 1개 × 800,000원   │   │
│ │         = 880,000원│   │
│ └────────────────────┘   │
├──────────────────────────┤
│ 공급가액:  1,500,000원   │
│ 부가세:      150,000원   │
│ ─────────────────────    │
│ 합  계:  1,650,000원     │
├──────────────────────────┤
│ 메모: 계약금 50% 선입금  │
│ 유효: 2026-07-26까지     │
├──────────────────────────┤
│ ┌──────────────────────┐ │
│ │    PDF 다운로드 ↓    │ │  ← 하단 고정 버튼
│ └──────────────────────┘ │
└──────────────────────────┘
```

**사용 컴포넌트**:

| 컴포넌트 | 출처 | 용도 |
|---------|------|------|
| `Badge` | ShadcnUI | 상태 뱃지 |
| `Button` | ShadcnUI | PDF 다운로드 버튼 |
| `Card`, `CardHeader`, `CardContent` | ShadcnUI | 발행자/수신자 정보 블록 |
| `Separator` | radix-ui | 섹션 구분선 |
| TanStack Table v8 커스텀 | 직접 구현 | 견적 항목 테이블 (데스크탑) |
| 카드 목록 | 직접 구현 | 견적 항목 (모바일) |
| `Skeleton` | ShadcnUI | 로딩 상태 플레이스홀더 |

---

### 화면 2: 에러 페이지

**404 — 잘못된 토큰**:
```
┌────────────────────────────────┐
│           404                  │
│   견적서를 찾을 수 없습니다.  │
│                                │
│   요청하신 견적서 링크가       │
│   존재하지 않거나 삭제되었    │
│   습니다. 발행자에게 문의해   │
│   주세요.                      │
│                                │
│   [홈으로 돌아가기]            │
└────────────────────────────────┘
```

**410 — 만료된 견적서**:
```
┌────────────────────────────────┐
│           ⏰                   │
│   견적서 유효기간이            │
│   만료되었습니다.              │
│                                │
│   이 견적서는 2026-07-26에    │
│   만료되었습니다. 최신 견적서 │
│   는 발행자에게 문의해 주세요. │
│                                │
│   [발행자에게 문의]            │
└────────────────────────────────┘
```

---

### 화면 3: 관리자 대시보드 (`/dashboard/invoices`) — P1

```
┌────────────────────────────────────────────────────────────────┐
│ 대시보드 / 견적서 관리                     [Notion 동기화 ↺]  │
├──────────────────────────────────────────────────────────────  │
│ [전체 ▼]  [🔍 견적서 번호 또는 고객명 검색...]               │
├────────────────────────────────────────────────────────────────┤
│ 번호        │ 제목          │ 고객명   │ 상태   │ 발행일  │ 작업│
│─────────────┼───────────────┼──────────┼────────┼─────────┼────│
│INV-2026-003 │ 앱 개발 견적  │ (주)ABC  │발송됨  │26.06.20 │ [🔗]│
│INV-2026-002 │ 디자인 견적   │ 홍씨상사 │수락됨  │26.06.15 │ [🔗]│
│INV-2026-001 │ 웹사이트 견적 │ DEF Inc  │만료됨  │26.05.30 │ [🔗]│
└────────────────────────────────────────────────────────────────┘
```

**[🔗] 버튼**: 뷰어 URL을 클립보드에 복사 후 toast 알림

---

## 7. 비기능 요구사항 (Non-Functional Requirements)

### 성능

| 지표 | 목표 | 측정 방법 |
|------|------|----------|
| LCP (뷰어 첫 로딩) | < 2.5s | Chrome DevTools / Lighthouse |
| PDF 생성 시간 | < 5s | 서버 응답 시간 측정 |
| Notion API 캐시 TTL | 5분 (300s) | `Cache-Control: s-maxage=300` |
| 동시 요청 처리 | Vercel Serverless 기본 스케일링 | — |

**캐싱 전략**:
- 견적서 데이터: `unstable_cache` (Next.js) + `revalidateTag("invoice-[token]")` 조합
- 뷰어 페이지: `ISR(Incremental Static Regeneration)` 또는 `dynamic = "force-static"` 불가 → 토큰 기반 공개 페이지이므로 Edge Cache 활용

---

### 보안

| 항목 | 요구사항 |
|------|---------|
| URL 토큰 엔트로피 | 256bit (HMAC-SHA256 출력) |
| HTTPS | 필수 (Vercel 자동 제공) |
| Notion API 키 | 서버 환경변수만 사용, 클라이언트 번들에 포함 금지 |
| 관리자 API | Basic Auth + HTTPS (MVP), 향후 JWT로 대체 |
| PDF 다운로드 | `Cache-Control: private, no-store` (공유 캐시 저장 금지) |
| 입력 검증 | 모든 외부 입력에 Zod 스키마 적용 |

---

### 접근성

- WCAG 2.1 AA 준수
- 색상 대비비 ≥ 4.5:1 (텍스트), ≥ 3:1 (UI 요소)
- 키보드 네비게이션 완전 지원
- 스크린 리더: `aria-label`, `role`, `aria-live` 적절히 사용
- PDF: 태그드 PDF (텍스트 레이어 포함)

---

### 반응형

| 브레이크포인트 | 레이아웃 |
|--------------|---------|
| 375px ~ 767px (모바일) | 항목 카드 목록, 하단 고정 다운로드 버튼 |
| 768px ~ 1023px (태블릿) | 항목 테이블, 2컬럼 정보 그리드 |
| 1024px ~ 1440px (데스크탑) | 항목 테이블 전체 컬럼, 우상단 다운로드 버튼 |

---

## 8. Notion API 연동 전략

### 인증 방식

`Internal Integration Token` 방식 사용. Notion 워크스페이스에 Integration을 생성하고 발급받은 Secret Key를 `NOTION_API_KEY` 환경변수로 관리.

```bash
# .env.local
NOTION_API_KEY=secret_...
NOTION_DATABASE_ID=...
NOTION_TOKEN_SECRET=...  # 토큰 생성용 HMAC 키 (최소 32자 랜덤 문자열)
```

---

### 데이터 동기화 방식 선택

**추천: Option A — 요청 시 실시간 조회 + Next.js 캐싱**

| 항목 | Option A (실시간 + 캐시) | Option B (폴링 + 내부 DB) |
|------|------------------------|--------------------------|
| 구현 복잡도 | 낮음 | 높음 (DB 스키마, ORM 추가) |
| 인프라 추가 비용 | 없음 | DB 비용 발생 |
| 데이터 신선도 | 캐시 TTL(5분) 주기 | 폴링 주기(예: 5분)와 동일 |
| Notion 장애 영향 | 캐시 만료 후 영향 | 폴링 중단 시 구식 데이터 |
| MVP 적합성 | ✅ 높음 | ❌ 낮음 |

**선택 근거**: MVP에서 내부 DB를 별도 운영하면 마이그레이션, ORM 설정, 스키마 관리 비용이 발생한다. Next.js의 `unstable_cache`와 `revalidateTag`로 캐시를 관리하면 Notion API Rate Limit(평균 3 req/s)을 충분히 준수하면서 5분 내 최신 데이터를 제공할 수 있다. 즉각적인 반영이 필요한 경우 `POST /api/admin/invoice/sync`로 on-demand revalidation을 제공한다.

---

### Rate Limit 대응 전략

Notion API 평균 3 req/s 제한 대응:

1. **캐시 TTL 300s**: 동일 견적서의 반복 조회 시 Notion API를 호출하지 않는다.
2. **재시도 전략**: 429 응답 수신 시 exponential backoff (1s → 2s → 4s, 최대 3회).
3. **동기화 배치 처리**: 전체 동기화 시 Notion API 호출 사이에 350ms 딜레이를 추가해 Rate Limit 초과를 방지한다.

```typescript
// src/lib/notion/client.ts (구현 예시)
async function fetchWithRetry<T>(
  fn: () => Promise<T>,
  retries = 3,
  delayMs = 1000,
): Promise<T> {
  try {
    return await fn()
  } catch (error) {
    if (retries > 0 && isRateLimitError(error)) {
      await sleep(delayMs)
      return fetchWithRetry(fn, retries - 1, delayMs * 2)
    }
    throw error
  }
}
```

---

### Notion Property Type → TypeScript 타입 매핑

| Notion Property Type | TypeScript 타입 | 접근 경로 |
|---------------------|----------------|----------|
| `title` | `string` | `property.title[0]?.plain_text ?? ""` |
| `rich_text` | `string` | `property.rich_text[0]?.plain_text ?? ""` |
| `date` | `string \| null` | `property.date?.start ?? null` |
| `select` | `string \| null` | `property.select?.name ?? null` |
| `url` | `string \| null` | `property.url ?? null` |
| `files` | `string \| null` | `property.files[0]?.external?.url ?? property.files[0]?.file?.url ?? null` |

---

## 9. PDF 생성 전략

### 라이브러리 비교

| 항목 | @react-pdf/renderer | puppeteer | html2canvas + jspdf |
|------|:-------------------:|:---------:|:-------------------:|
| 실행 환경 | 서버 (Node.js) | 서버 (Node.js) | 클라이언트 (브라우저) |
| 스타일 방식 | `StyleSheet.create()` (CSS 유사) | 기존 CSS 그대로 사용 | 기존 CSS 그대로 사용 |
| 한글 폰트 지원 | 수동 폰트 파일 임베드 필요 | OS/브라우저 폰트 자동 사용 | OS 폰트 자동 사용 |
| Vercel Serverless 호환 | ✅ | ❌ (headless Chromium 용량 초과) | ✅ (클라이언트) |
| 출력 품질 | 벡터 PDF (텍스트 선택 가능) | 벡터 PDF (텍스트 선택 가능) | 래스터 이미지 기반 |
| 번들 크기 | ~1.5MB | ~170MB (Chromium) | ~500KB |
| 구현 난이도 | 중간 (별도 레이아웃 작성) | 낮음 (기존 HTML 사용) | 낮음 |

### 선택: `@react-pdf/renderer`

**선택 이유**:
1. **Vercel 호환**: puppeteer는 Vercel Serverless 함수의 번들 크기 제한(50MB)을 초과하므로 제외.
2. **서버사이드 일관성**: html2canvas+jspdf는 클라이언트에서 실행되어 브라우저·OS 환경에 따라 출력 결과가 달라질 수 있음. 서버에서 생성하면 동일한 출력을 보장.
3. **벡터 PDF**: 텍스트 레이어가 있어 복사/검색이 가능하고 인쇄 품질이 우수함.

**한글 폰트 처리 계획**:
- Noto Sans KR (Regular, Bold) 폰트 파일을 `public/fonts/` 에 포함
- `@react-pdf/renderer`의 `Font.register()`로 빌드 시 임베드
- 폰트 용량 최적화: 서브셋팅 또는 Variable Font 사용 검토

```typescript
// src/lib/pdf/fonts.ts
import { Font } from "@react-pdf/renderer"

Font.register({
  family: "Noto Sans KR",
  fonts: [
    { src: "/fonts/NotoSansKR-Regular.ttf", fontWeight: 400 },
    { src: "/fonts/NotoSansKR-Bold.ttf", fontWeight: 700 },
  ],
})
```

---

## 10. 마일스톤 (Milestones)

| 스프린트 | 기간 | 목표 | 완료 기준 (Definition of Done) |
|---------|------|------|-------------------------------|
| **Sprint 1** | 1주차 | Notion 연동 + 기본 뷰어 | `/invoice/[token]`에서 실제 Notion 데이터가 렌더됨. 발행자/수신자 정보, 항목 테이블, 합계 표시 확인. |
| **Sprint 2** | 2주차 | PDF 다운로드 + 에러 처리 | PDF 다운로드 버튼 클릭 시 한글 깨짐 없는 A4 PDF 파일 저장. 404/410 에러 페이지 동작 확인. |
| **Sprint 3** | 3주차 | 관리자 대시보드 + 성능 최적화 | `/dashboard/invoices` 목록·필터·URL 복사 동작. Notion 동기화 버튼 동작. Lighthouse LCP < 2.5s 달성. |

### Sprint 1 세부 태스크

- [ ] 환경변수 설정 및 Notion SDK 초기화 (`@notionhq/client`)
- [ ] Notion DB 데이터 → `Invoice` 타입 매핑 함수 구현
- [ ] HMAC 기반 토큰 생성 유틸리티 구현
- [ ] `GET /api/invoice/[token]` Route Handler 구현
- [ ] `/invoice/[token]` 뷰어 페이지 기본 레이아웃
- [ ] 발행자/수신자 정보 `Card` 컴포넌트
- [ ] 견적 항목 테이블 (TanStack Table v8)

### Sprint 2 세부 태스크

- [ ] `@react-pdf/renderer` 설치 및 Noto Sans KR 폰트 설정
- [ ] PDF 레이아웃 컴포넌트 구현 (`InvoicePDF`)
- [ ] `GET /api/invoice/[token]/pdf` Route Handler 구현
- [ ] PDF 다운로드 버튼 클라이언트 컴포넌트 (`DownloadButton`)
- [ ] 404 에러 페이지 (`app/invoice/not-found.tsx`)
- [ ] 410 만료 페이지 (만료 판별 미들웨어 또는 Route Handler)
- [ ] 모바일 반응형 레이아웃 완성

### Sprint 3 세부 태스크

- [ ] Basic Auth 미들웨어 (`middleware.ts`)
- [ ] `POST /api/admin/invoice/sync` Route Handler
- [ ] `/dashboard/invoices` 페이지 + TanStack Table
- [ ] 상태 필터 (`nuqs` URL 상태 관리)
- [ ] URL 복사 버튼 + sonner toast
- [ ] `unstable_cache` + `revalidateTag` 적용
- [ ] Lighthouse CI 측정 및 LCP 최적화

---

## 11. 미결 사항 (Open Questions)

| # | 질문 | 영향 범위 | 결정 기한 | 임시 가정 |
|---|------|----------|----------|----------|
| OQ-01 | 견적서 수정 시 URL 유지 여부: Notion 페이지 ID 기반 HMAC이므로 토큰은 불변. 단, 수신자가 PDF를 저장해 둔 경우 구버전 PDF와 웹 최신 내용이 다를 수 있다. 이를 허용할 것인가? | 보안·UX | Sprint 1 전 | 토큰 불변 유지. 웹 뷰어가 항상 최신 내용을 보여줌을 안내 문구로 명시. |
| OQ-02 | 클라이언트 수락/거절 기능을 MVP에 포함할 것인가? | 범위 | Sprint 1 전 | Out of Scope. Notion 상태 필드를 사업자가 직접 변경하는 방식으로 대체. |
| OQ-03 | 다중 사업자(멀티테넌트) 지원 시점 | 아키텍처 | Sprint 3 후 | MVP는 단일 Notion 워크스페이스만 지원. |
| OQ-04 | 견적 항목을 Notion DB 내 JSON 필드로 관리 시, 항목이 많으면 Rich Text 2000자 제한에 걸릴 수 있다. 대안 필요한가? | 데이터 모델 | Sprint 1 전 | 항목 최대 20개 제한 안내. 초과 시 Notion 관계형 DB 마이그레이션 검토. |
| OQ-05 | 관리자 대시보드 접근에 Basic Auth 외 별도 인증(OAuth 등)이 필요한가? | 보안 | Sprint 3 전 | MVP는 `ADMIN_PASSWORD` 환경변수 기반 Basic Auth. 멀티테넌트 전환 시 Next-Auth 도입. |
