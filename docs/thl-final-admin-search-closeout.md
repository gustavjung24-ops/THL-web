# THL Final Admin + Search Closeout

Ngay cap nhat: 2026-05-03

## 1) Admin login da sua the nao
- Nguyen nhan loi OTP: luong dang nhap bat buoc `request_otp -> verify_otp`, nhung ha tang gui mail OTP co the chua san sang (mailer/env), nen `/admin/login` de roi vao trang thai "Khong the yeu cau OTP".
- Quyết dinh chot release: bo OTP bat buoc cho admin noi bo.
- Luong moi: email + password -> tao HttpOnly session cookie (`thl_admin_session`) -> redirect vao `nextPath`.
- Khong dung localStorage token, khong expose secret ra client.
- Neu thieu ENV quan trong (`ADMIN_SECRET`, `ADMIN_OWNER_EMAIL`, `ADMIN_OWNER_PASSWORD`) thi tra loi loi cau hinh ro rang tren API login.

## 2) Route admin hoat dong
- `/admin`
- `/admin/login`
- `/admin/bao-gia`
- `/admin/bao-gia/tao-moi`
- `/admin/bao-gia/[id]`
- `/admin/mail`
- `/admin/phan-quyen`

Ghi chu: route duoc bao ve bang session cookie + permission check trong server page/API.

## 3) Tach 2 luong RFQ va bao gia chu dong
- RFQ tu web:
  - list tai `/admin/bao-gia` (filter source/status)
  - mo chi tiet `/admin/bao-gia/[id]`
  - sua/trang thai + quote editor theo luong RFQ
  - copy Zalo/email + HTML print trong chi tiet
- Bao gia chu dong:
  - tao moi tai `/admin/bao-gia/tao-moi`
  - sinh ban ghi `sourceType=manual`
  - mo chi tiet `/admin/bao-gia/[id]` voi editor cho quote chu dong

## 4) Zalo handoff da doi chua
- Da dung luong copy clipboard + nut `Mo Zalo` mo `siteConfig.zaloLink`.
- Khong dung `navigator.share`.
- Khong mo free share sheet.
- Khong reset danh sach ma sau khi mo Zalo.

## 5) Koyo public hien co nhom ma nao
- Public search Koyo hien giu nhom du lieu co nguon that dang public: Bearing Units (UC/UCP/UCF/UCFL) tu `koyo_bearing_units_web_import.json`.

## 6) Vi sao Koyo 6205/6206/6307 chua hien
- Bo generated 60xx/62xx/63xx da duoc dua ra khoi public.
- Chua co nguon Koyo/JTEKT da doi chieu tung ma de public.
- UI giu banner thong bao thieu du lieu Koyo 60xx/62xx/63xx.

## 7) File generated Koyo da go khoi public chua
- Da go khoi `public/data/products`:
  - `koyo_deep_groove_web_import.json`
  - `koyo_tapered_roller_web_import.json`
  - `koyo_cylindrical_roller_web_import.json`
- Da chuyen reference vao:
  - `data_SP/research/koyo/generated-reference/`
- Metadata reference da gan nhan:
  - `verification_status = generated_reference`
  - `import_status = not_public`
  - `public_visible = false`
  - `confidence = manual_review`

## 8) Phan con lai
### Khong chan release
- UI tra ma da bo CTA/floating trung chuc nang tren trang `/tra-ma-bao-gia`.
- Bottom mobile da chot 2 nut: `Tra Ma` va `Ung dung nganh`.
- Ket qua tra ma da co load-more 20/lần + reset ve 20 khi doi filter/query.

### Can xu ly sau (neu muon parity SKF cao hon)
- Nang cap man tao bao gia chu dong de co catalog picker ngay tren trang tao moi (hien tai da co luong tao record + sua chi tiet, nhung UX co the tiep tuc toi uu).
- Neu muon bat lai OTP trong tuong lai: bo sung env + mail transport on dinh, va de OTP thanh optional theo env flag.

## Mapping component/admin lib (THL -> muc tieu SKF)
- `admin-shell` -> `src/components/admin/admin-shell.tsx`
- `admin-login-form` -> `src/components/admin/admin-login-form.tsx`
- `proactive-quote-editor` -> `src/components/admin/proactive-quote-editor.tsx`
- `rfq/quote-request editor` -> `src/components/admin/rfq-quote-editor.tsx`, `src/components/admin/quote-request-editor.tsx`
- `quote-print-actions` -> `src/components/admin/quote-print-actions.tsx`
- `admin-mail-composer` -> `src/components/admin/admin-mail-composer.tsx`
