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
