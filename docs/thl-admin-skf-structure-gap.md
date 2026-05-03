# THL Admin vs SKF Structure Gap

Generated at: 2026-05-03

## Scope

- src/app/admin
- src/app/api/admin
- src/components/admin
- src/lib/admin

## 1) src/app/admin

| Area | SKF | THL (hien tai) | Danh gia |
|---|---|---|---|
| Admin root | co | co | dat |
| /admin/bao-gia | co | co | dat |
| /admin/bao-gia/[id] | co | co | dat |
| /admin/bao-gia/tao-moi | co | co | dat |
| /admin/login | co | co | dat |
| /admin/mail | co | co | dat |
| /admin/phan-quyen | co | co | dat |
| /admin/bao-gia/[id]/print | co | chua tach page rieng (THL su dung quote-print-actions) | kha biet nho, chua la blocker |

## 2) src/app/api/admin

| Area | SKF | THL truoc | THL sau chuan hoa |
|---|---|---|---|
| /api/admin/quotes | co | chua co | da co GET danh sach quote manual |
| /api/admin/quotes/manual | co | co | dat |
| /api/admin/quotes/catalog-search | co | chua co | da co |
| /api/admin/rfq | co | chua co | da co |
| /api/admin/rfq/[id] | co | chua co | da co |
| /api/admin/rfq/[id]/status | co | chua co | da co |
| auth/mail/users | co | co | dat |

## 3) src/components/admin

| Area | SKF | THL truoc | THL sau chuan hoa |
|---|---|---|---|
| proactive-quote-editor.tsx | co | co | dat |
| rfq-quote-editor.tsx | co | chua co | da them wrapper alias |
| quote-request-editor.tsx | khac ten | co | giu lai de backward compatibility |

Ket luan: quote-request-editor.tsx cua THL tuong duong vai tro rfq-quote-editor.tsx cua SKF. Da them rfq-quote-editor.tsx de ro ten, khong pha API/component hien co.

## 4) src/lib/admin

| Area | SKF | THL truoc | THL sau chuan hoa |
|---|---|---|---|
| catalog-search.ts | co | chua co | da co (multi-brand, khong suy dien variant) |
| price-master.ts | co | chua co | da co (provider abstraction) |
| proactive-quote.ts | co | chua co | da co |
| sheet-webhook.ts | co | chua co | da co |
| quote-store/workflow/auth/storage | co (kien truc tuong duong) | co | dat |

## 5) Tach 2 luong admin

### A. RFQ tu khach

- Endpoint rieng:
  - /api/admin/rfq
  - /api/admin/rfq/[id]
  - /api/admin/rfq/[id]/status
- Trang chi tiet /admin/bao-gia/[id] da map editor theo sourceType:
  - sourceType=rfq -> RfqQuoteEditor

### B. Bao gia chu dong

- Endpoint rieng:
  - /api/admin/quotes (list quote manual)
  - /api/admin/quotes/manual (tao quote manual)
- UI proactive-quote-editor giu nguyen cho luong tao chu dong.

## 6) Catalog search va multi-brand

THL da co src/lib/admin/catalog-search.ts voi mapping brand:

- NTN
- Koyo/JTEKT
- Tsubaki
- NOK
- Mitsuba
- Soho V-Belt

Nguyen tac duoc giu:

- Khong tu sinh ma bien the.
- Khong lam long brand-suffix-policy da khoa.

## 7) Price master abstraction

THL da co src/lib/admin/price-master.ts voi schema provider:

- brand
- normalized_code
- code
- product_group
- price_vnd
- price_status
- source
- source_url

Ghi chu:

- Gia chi dung trong admin pipeline.
- Khong public gia ra trang khach.

## 8) Sheet/backend provider

THL da co src/lib/admin/sheet-webhook.ts:

- dung GOOGLE_SHEET_WEBHOOK_URL
- dung GOOGLE_SHEET_WEBHOOK_SECRET
- khong hard-code secret
- khong dung localStorage lam nguon admin chinh

## 9) Ranh gioi voi quy tac du lieu

Trong dot chuan hoa admin nay:

- Khong tao fake data Koyo 6205.
- Khong noi long policy suffix (NTN RS/2RS/RS2...).
- Khong copy cứng rule SKF sang THL multi-brand.

## 10) Gap con lai (de lam tiep)

- Neu can parity cao hon voi SKF, co the tach page print rieng /admin/bao-gia/[id]/print thay vi action print client.
- Bo sung dashboard KPI rieng cho RFQ vs proactive quote (hien tai da co tach luong API, nhung UI tong hop chua chia block KPI rieng).
