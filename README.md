# Luan Phu Tung Web

Website thương hiệu cá nhân, tập trung thu lead, hỗ trợ tra mã và tiếp nhận nhu cầu báo giá phụ tùng công nghiệp.

## Mục tiêu

- Hỗ trợ tra mã nhanh, rõ và đúng nhu cầu.
- Tư vấn nhóm hàng phù hợp theo ứng dụng thực tế.
- Tiếp nhận yêu cầu báo giá qua form, Zalo và gọi điện.
- Xây dựng uy tín cá nhân theo hướng thực chiến, dễ hiểu.

## Công nghệ sử dụng

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- react-hook-form + zod (validation)
- Upload ảnh local mock (đã tách interface để nối cloud sau)
- Dữ liệu blog local JSON (dễ thay bằng Sanity/MDX sau)

## Cấu trúc route chính

- `/` Trang chủ
- `/gioi-thieu`
- `/san-pham`
- `/san-pham/[slug]`
- `/giai-phap-theo-khach-hang`
- `/tra-ma-bao-gia`
- `/kien-thuc`
- `/lien-he`

## Cấu hình placeholder tập trung

Toàn bộ thông tin placeholder (tên cá nhân, số điện thoại, Zalo, email, khu vực...) nằm trong:

- `src/config/site.ts`

Khi có thông tin thật, chỉ cần sửa một chỗ để cập nhật toàn site.

## Chạy local

Yêu cầu:

- Node.js 18.17+ (khuyến nghị Node 20)

Cài dependencies:

```bash
npm install
```

Chạy môi trường dev:

```bash
npm run dev
```

Mở trình duyệt tại:

- `http://localhost:3000`

## Lint và build

Chạy lint:

```bash
npm run lint
```

Build production:

```bash
npm run build
```

Chạy bản build local:

```bash
npm run start
```

## AI tra ma hoat dong the nao

He thong co them chatbot "Tra ma nhanh" (bubble goc phai duoi) de tiep nhan nhu cau va goi y ma tu catalog noi bo.

Luong xu ly hien tai:

1. Nhan thong tin nguoi dung: ma cu, kich thuoc, ung dung, hoac anh tem (mock UI).
2. Goi OpenAI Responses API voi function calling den cac tool noi bo:
	 - `search_exact_code`
	 - `search_by_dimensions`
	 - `search_equivalent_code`
	 - `validate_allowed_brand`
	 - `get_missing_fields_for_group`
3. Ep ket qua theo Structured Outputs JSON schema de UI render an toan.
4. Neu thieu du lieu thi hoi them 1-3 truong thong tin ky thuat.
5. Co discovery flow ngan (toi da 3 buoc) de lay them thong tin khi input con mo ho.
6. Co tang parser nhan dien he may, cum may, trieu chung, muc khan va dong co mua hang.

Discovery flow chi hien khi:

- Khach chi chao hoi hoac noi chung chung.
- Khach gui cau cut, shorthand, thieu du lieu de chot ma.

Discovery flow se bo qua va xu ly ngay khi:

- Khach da cung cap ma, kich thuoc hoac ung dung du ro de doi chieu.

Luu y van hanh:

- Chatbot khong bao gia tu dong.
- Chatbot khong tu ket luan ton kho.
- Neu khong co du lieu catalog, phan hoi theo huong:
	- "Chua co du lieu ma trong he thong"
	- "Can xac minh them"
	- "Ngoai danh muc dang ho tro"

## Bien moi truong cho AI assistant

Can cau hinh trong moi truong runtime:

- `OPENAI_API_KEY`: API key de goi OpenAI Responses API.
- `OPENAI_MODEL`: model su dung cho assistant (neu bo trong se fallback ve model an toan mac dinh).

Neu thieu `OPENAI_API_KEY`, toan bo site van render binh thuong; chi endpoint `/api/assistant` tra ve loi fail graceful de de debug.

Vi du `.env.local`:

```bash
OPENAI_API_KEY=<your_api_key>
OPENAI_MODEL=gpt-5-mini
```

## Du lieu demo

Du lieu catalog demo dang nam tai:

- `src/data/catalog/brand-whitelist.json`
- `src/data/catalog/master-catalog.json`
- `src/data/catalog/equivalent-map.json`
- `src/data/catalog/technical-rules.json`

Bo du lieu nay la du lieu mau de test luong tra ma, chua phai catalog that.

## Deploy lên Vercel

### Cách nhanh (qua dashboard)

1. Push code lên GitHub.
2. Vào Vercel, chọn Import Project.
3. Chọn repository và deploy.
4. Build command: `npm run build`.
5. Output: mặc định Next.js.

### Cách qua CLI

```bash
npm i -g vercel
vercel
```

Deploy production:

```bash
vercel --prod
```

## Gợi ý nâng cấp tiếp theo

- Kết nối form vào CRM/Google Sheet/API.
- Thay upload local mock bằng cloud storage (S3/Cloudinary/Supabase Storage).
- Chuyển blog từ JSON sang Sanity hoặc MDX.
- Thêm tracking conversion cho nút gọi/Zalo/form submit.
