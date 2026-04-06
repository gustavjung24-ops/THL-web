# Truyền Động Công Nghiệp

Website tư vấn vật tư truyền động cho nhà máy và khách công nghiệp, tập trung vào tra mã nhanh, tiếp nhận nhu cầu và hỗ trợ chọn đúng nhóm hàng theo ứng dụng thực tế.

## Mục tiêu

- Tra mã vòng bi, gối đỡ, dây curoa, phớt, khớp nối qua chatbot AI
- Hướng dẫn đúng mã khi chưa biết (discovery flow, tối đa 3 bước)
- Tiếp nhận yêu cầu báo giá qua form, Zalo, gọi điện

## Công nghệ

- **Framework:** Next.js 14 · App Router · TypeScript
- **UI:** Tailwind CSS · shadcn/ui
- **Form:** react-hook-form · zod
- **AI:** OpenAI Responses API · Gemini API · function calling
- **Dữ liệu:** JSON catalog · JSON blog

## Routes

- `/` — Trang chủ
- `/san-pham` — Danh mục sản phẩm
- `/san-pham/[slug]` — Chi tiết nhóm hàng
- `/giai-phap-theo-khach-hang` — Giải pháp theo khách hàng
- `/tra-ma-bao-gia` — Tra mã & báo giá
- `/kien-thuc` — Bài viết kỹ thuật
- `/gioi-thieu` — Giới thiệu
- `/lien-he` — Liên hệ

## Chatbot tra mã

- Bubble góc phải dưới, gọi AI qua `/api/assistant` (hỗ trợ OpenAI / Gemini)
- Nhận input: mã cũ, kích thước, ứng dụng, triệu chứng
- Parse ngữ cảnh (câu cụt, shorthand)
- Discovery flow ngắn nếu thiếu dữ liệu
- Đối chiếu catalog nội bộ, trả structured output
- Không báo giá tự động, không tự kết luận tồn kho

## Cấu hình

Site config: `src/config/site.ts`

### Biến môi trường

```env
# Provider (mặc định: openai)
ASSISTANT_PROVIDER=openai        # hoặc gemini

# OpenAI
OPENAI_API_KEY=<your_key>
OPENAI_MODEL=gpt-4o-mini

# Gemini (chỉ cần nếu ASSISTANT_PROVIDER=gemini)
GEMINI_API_KEY=<your_key>
GEMINI_MODEL=gemini-2.5-flash
```

- `ASSISTANT_PROVIDER=gemini` → dùng Gemini, tự fallback về OpenAI nếu Gemini lỗi
- Thiếu API key → site vẫn chạy, chatbot trả lỗi graceful

### Catalog demo

- `src/data/catalog/master-catalog.json`
- `src/data/catalog/equivalent-map.json`
- `src/data/catalog/brand-whitelist.json`
- `src/data/catalog/technical-rules.json`

Dữ liệu mẫu, chưa phải catalog vận hành.

## Phát triển

```bash
npm install
npm run dev       # http://localhost:3000
npm run lint
npm run build
npm run start
```

Yêu cầu Node.js 18.17+.

## Deploy

```bash
vercel --prod
```

Hoặc import repo từ Vercel dashboard.

## Nâng cấp tiếp theo

- Form → CRM / Google Sheet
- Upload ảnh → S3 / Cloudinary
- Blog → Sanity hoặc MDX
- Tracking conversion (gọi / Zalo / form)
