# Truyền Động Công Nghiệp

Website tư vấn vật tư truyền động cho nhà máy và khu công nghiệp, tập trung tra mã nhanh, tư vấn theo nhu cầu kỹ thuật và tiếp nhận yêu cầu báo giá.

## Mục tiêu

- Hỗ trợ tra mã nhanh, rõ và đúng theo ngữ cảnh hiện trường.
- Tư vấn nhóm hàng phù hợp theo ứng dụng thực tế.
- Tiếp nhận yêu cầu báo giá qua form, Zalo và gọi điện.
- Xây dựng nội dung kỹ thuật dễ hiểu cho vận hành nhà máy.

## Công nghệ sử dụng

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- react-hook-form + zod
- Upload ảnh local mock (đã tách interface để nối cloud sau)
- Dữ liệu blog local JSON

## Cấu trúc route chính

- `/` Trang chủ
- `/gioi-thieu`
- `/san-pham`
- `/san-pham/[slug]`
- `/giai-phap-theo-khach-hang`
- `/tra-ma-bao-gia`
- `/kien-thuc`
- `/lien-he`

## Cấu hình thông tin site

Thông tin site (brand, hotline, email, địa chỉ...) nằm tại:

- `src/config/site.ts`

Chỉ cần cập nhật một nơi để đồng bộ toàn bộ website.

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

## Chatbot tra mã nhanh

Chatbot "Tra mã nhanh" (bubble góc phải dưới) dùng OpenAI Responses API + function calling để tra mã theo catalog nội bộ.

Luồng hiện tại:

1. Nhận input từ người dùng: mã cũ, kích thước, ứng dụng, mô tả triệu chứng.
2. Parse ngữ cảnh câu cụt, shorthand hoặc input mơ hồ.
3. Discovery flow ngắn (tối đa 3 bước) khi dữ liệu chưa đủ.
4. Gọi tool nội bộ để đối chiếu mã.
5. Ép kết quả theo structured output schema để UI render an toàn.

Nguyên tắc vận hành:

- Có discovery flow ngắn cho input mơ hồ.
- Hiểu câu cụt / thiếu ngữ pháp kiểu hiện trường.
- Không báo giá tự động.
- Không tự kết luận tồn kho.
- Nếu thiếu dữ liệu catalog: ưu tiên phản hồi an toàn, yêu cầu xác minh thêm.

Nếu thiếu `OPENAI_API_KEY`:

- Site vẫn render bình thường.
- Chỉ endpoint `/api/assistant` fail graceful với thông báo phù hợp.

## Biến môi trường cho AI assistant

Cần cấu hình runtime:

- `OPENAI_API_KEY`: API key gọi OpenAI Responses API.
- `OPENAI_MODEL`: model dùng cho assistant (nếu để trống sẽ dùng model mặc định an toàn).

Ví dụ `.env.local`:

```bash
OPENAI_API_KEY=<your_api_key>
OPENAI_MODEL=gpt-5-mini
```

## Dữ liệu demo

Catalog demo đang nằm tại:

- `src/data/catalog/brand-whitelist.json`
- `src/data/catalog/master-catalog.json`
- `src/data/catalog/equivalent-map.json`
- `src/data/catalog/technical-rules.json`

Đây là dữ liệu mẫu phục vụ test luồng tra mã, chưa phải catalog vận hành thực tế.

## Deploy lên Vercel

### Cách nhanh (dashboard)

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
