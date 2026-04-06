# Truyền Động Công Nghiệp

Website tư vấn vật tư truyền động cho nhà máy và khu công nghiệp — tra mã nhanh, tư vấn theo ứng dụng thực tế, tiếp nhận báo giá.

## Tính năng chính

- **Tra mã nhanh** — chatbot AI tra mã vòng bi, gối đỡ, dây curoa, phớt, khớp nối theo catalog nội bộ.
- **Discovery flow** — hướng dẫn ngắn (tối đa 3 bước) khi người dùng chưa biết mã.
- **Trang sản phẩm** — danh mục nhóm hàng, trang chi tiết mỗi nhóm.
- **Form báo giá** — tiếp nhận yêu cầu qua form, Zalo, gọi điện.
- **Kiến thức kỹ thuật** — bài viết hỗ trợ vận hành nhà máy.

## Công nghệ

| Layer | Stack |
|-------|-------|
| Framework | Next.js 14 · App Router · TypeScript |
| UI | Tailwind CSS · shadcn/ui |
| Form | react-hook-form · zod |
| AI | OpenAI Responses API · function calling |
| Data | JSON catalog · JSON blog |

## Routes

| Path | Nội dung |
|------|----------|
| `/` | Trang chủ |
| `/san-pham` | Danh mục sản phẩm |
| `/san-pham/[slug]` | Chi tiết nhóm hàng |
| `/giai-phap-theo-khach-hang` | Giải pháp theo khách hàng |
| `/tra-ma-bao-gia` | Tra mã & gửi yêu cầu báo giá |
| `/kien-thuc` | Bài viết kỹ thuật |
| `/gioi-thieu` | Giới thiệu |
| `/lien-he` | Liên hệ |

## Chatbot tra mã

Bubble góc phải dưới, gọi OpenAI qua `/api/assistant`.

**Luồng:**
1. Nhận input: mã cũ, kích thước, ứng dụng, triệu chứng.
2. Parse ngữ cảnh (câu cụt, shorthand).
3. Discovery flow ngắn nếu thiếu dữ liệu.
4. Đối chiếu catalog nội bộ.
5. Trả kết quả theo structured output schema.

**Nguyên tắc:** không báo giá tự động, không tự kết luận tồn kho, ưu tiên phản hồi an toàn.

## Cấu hình

Thông tin site tập trung tại `src/config/site.ts`.

### Biến môi trường

```env
OPENAI_API_KEY=<your_key>
OPENAI_MODEL=gpt-4o-mini    # tuỳ chọn
```

> Thiếu `OPENAI_API_KEY` → site vẫn chạy, chỉ chatbot trả lỗi graceful.

### Catalog demo

```
src/data/catalog/master-catalog.json
src/data/catalog/equivalent-map.json
src/data/catalog/brand-whitelist.json
src/data/catalog/technical-rules.json
```

Dữ liệu mẫu, chưa phải catalog vận hành thực tế.

## Phát triển

```bash
npm install
npm run dev          # http://localhost:3000
npm run lint
npm run build
npm run start        # chạy bản build
```

Yêu cầu Node.js 18.17+ (khuyến nghị Node 20).

## Deploy

```bash
# Vercel CLI
npm i -g vercel
vercel --prod
```

Hoặc import repo từ Vercel dashboard, build command `npm run build`.

## Nâng cấp tiếp theo

- Kết nối form → CRM / Google Sheet
- Upload ảnh → cloud storage (S3 / Cloudinary)
- Blog → Sanity hoặc MDX
- Tracking conversion cho nút gọi / Zalo / form
