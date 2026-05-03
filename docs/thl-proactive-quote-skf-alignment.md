# THL Proactive Quote SKF Alignment

## Muc tieu
- Hoan thien luong tao bao gia chu dong trong admin theo huong thao tac nhanh giong SKF.
- Giu nguyen nguyen tac THL: khong suy dien ma, khong lo gia noi bo ra public, uu tien multi-brand an toan.

## Pham vi da trien khai
- UI trang tao moi bao gia chu dong trong admin.
- API catalog search + manual quote upsert cho admin.
- Mo hinh quote chu dong + tinh tong + copy text + print HTML.
- Tach helper RFQ server-only de tranh import cheo vao client bundle.

## Mapping theo yeu cau
### A. Data va safety
- Khong tao ma gia/suffix suy dien.
- Catalog search chi dung du lieu that tu product import JSON va tra ve ket qua khop.
- Gia noi bo chi nam trong admin API/flow.

### B. Catalog search
- Co bo loc brand + nhom san pham.
- Co score va confidence cho ket qua tim kiem.
- Co trang thai gia: ok, stale, contact, khong tim thay, unavailable.

### C. UI tao moi
- Cac block chinh:
  - thong tin khach
  - tim ma va them nhanh nhieu dong
  - dong thu cong khi catalog khong co
  - bang item da chon voi quantity/price/discount
  - tong ket + trang thai + ghi chu noi bo
  - CTA: luu, copy zalo/email, in HTML/print

### D. Manual line
- Co form them dong thu cong voi code, name, brand, quantity, unit price, note.
- Dinh danh source = manual_admin, confidence = manual_review.

### E. API va persistence
- /api/admin/quotes/catalog-search: response theo contract moi.
- /api/admin/quotes/manual: ho tro GET (list/by id) va POST upsert quote.
- /api/admin/quotes: list proactive quote qua proactive store adapter.

### F. Khong pha RFQ cu
- Tach RFQ helper sang module server-only rieng.
- Cac route RFQ da doi import sang module moi.

## Build va verify
- Da chay production build thanh cong: pnpm build.
- Build pass lint + type-check + generate app routes.

## Ghi chu
- Print hien tai dung popup HTML print-friendly.
- Dong "Xuat PDF/print" dang goi print dialog cua popup de phuc vu xuat PDF qua trinh duyet.
