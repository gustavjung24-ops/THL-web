# THL Koyo Data Audit

Generated at: 2026-05-03

## Scope checked

- public/data/products/*_web_import.json
- src/data/catalog/*
- data_SP (if present)

## Summary

- Tổng số file product import: 6
- Tổng số record có brand Koyo/JTEKT: 72
- Các giá trị field brand thực tế trong product import:
  - Koyo
  - Mitsuba
  - NOK
  - NTN
  - Soho V-Belt
  - Tsubaki
- Số file trong src/data/catalog có chứa từ khóa KOYO/JTEKT: 8
- Số file trong data_SP có chứa từ khóa KOYO/JTEKT: 0

## 20 mã Koyo đầu tiên tìm được

1. UC201
2. UC202
3. UC203
4. UC204
5. UC205
6. UC206
7. UC207
8. UC208
9. UC209
10. UC210
11. UC211
12. UC212
13. UC213
14. UC214
15. UC215
16. UC216
17. UC217
18. UC218
19. UCF201
20. UCF202

## Nguyên nhân Koyo test có thể không ra

- Dữ liệu Koyo có thật, nhưng tập mã hiện tại là nhóm insert/pillow block (UC/UCP/UCF/UCFL), không phải nhóm deep groove kiểu 6205.
- Khi test bằng mã như Koyo 6205 thì không ra kết quả là đúng theo dữ liệu hiện có.
- Map brand trước đó đã xử lý KOYO, nhưng chưa bao phủ đầy đủ trường hợp brand đầu vào chứa JTEKT.

## Đã sửa ở đâu

- src/lib/product-search.ts
  - Mở rộng map để chấp nhận thêm brand đầu vào dạng JTEKT và các biến thể KOYO/JTEKT.
  - Giữ nguyên nguyên tắc không tự sinh biến thể mã.
- src/components/forms/multi-brand-product-lookup.tsx
  - Cải thiện UI lọc brand/group dạng chip dễ bấm.
  - Thêm vùng "Đang lọc" và nút "Xóa lọc".
  - Thêm thông báo rõ ràng khi không có dữ liệu theo nhãn hàng hoặc không có kết quả theo query.
- src/components/forms/quote-search-and-form.tsx
  - Bỏ hoàn toàn navigator.share.
  - Luồng Zalo đổi thành copy nội dung + mở thẳng siteConfig.zaloLink.

## Notes

- Không fake data Koyo.
- Không tự sinh mã biến thể.
- Không nới lỏng policy suffix đã khóa trước đó.
