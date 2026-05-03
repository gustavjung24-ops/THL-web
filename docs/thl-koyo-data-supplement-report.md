# Báo cáo bổ sung dữ liệu Koyo / JTEKT

> Ngày thực hiện: 2026-05-03  
> Phạm vi: Bổ sung data vòng bi Koyo cho trang tra mã THL

---

## 1. Tóm tắt

| File | Nhóm sản phẩm | Dòng (series) | Số mã | Nguồn kích thước |
|------|---------------|---------------|-------|-----------------|
| `koyo_deep_groove_web_import.json` | Vòng bi cầu rãnh sâu | 60xx, 62xx, 63xx | 60 | ISO 15:2017 |
| `koyo_tapered_roller_web_import.json` | Vòng bi đũa côn | 302xx, 303xx, 322xx | 37 | ISO 355 / JIS B 1512-5 |
| `koyo_cylindrical_roller_web_import.json` | Vòng bi đũa trụ | NU2xx, NU3xx, NJ2xx, NJ3xx, NUP2xx, NUP3xx | 56 | ISO 492 / JIS B 1512-3 |
| `koyo_bearing_units_web_import.json` *(hiện có)* | Gối đỡ / insert | UC, UCP, UCF, UCFL | 72 | Catalog Koyo |

**Tổng số mã bổ sung phiên này:** 153 mã (60 + 37 + 56)

---

## 2. Chi tiết từng file

### 2.1 koyo_deep_groove_web_import.json – 60 mã

| Dòng | Khoảng bore d | Số mã | Ghi chú |
|------|---------------|-------|---------|
| 6000–6020 | 10 – 100 mm | 21 | Dòng siêu nhẹ |
| 6200–6220 | 10 – 100 mm | 21 | Dòng phổ thông nhất; 6205/6206 priority_score=80 |
| 6300–6317 | 10 – 85 mm | 18 | Dòng nặng; 6307 priority_score=78 |

- **Nguồn kích thước:** ISO 15:2017 (d, D, B đồng nhất toàn ngành)
- **Confidence:** `manual_review` — đúng với ISO nhưng cần xác minh catalog Koyo/JTEKT trước khi báo giá chính thức

### 2.2 koyo_tapered_roller_web_import.json – 37 mã

| Dòng | Khoảng bore d | Số mã | Ghi chú |
|------|---------------|-------|---------|
| 30202–30215 | 15 – 75 mm | 14 | ISO 355 – T tin cậy |
| 30302–30312 | 15 – 60 mm | 11 | ISO 355 – T tin cậy |
| 32204–32211 | 20 – 55 mm | 12 | ⚠ T ước tính – xem lưu ý bên dưới |

**Trường đặc biệt:** `B_T_mm` = chiều cao lắp toàn bộ cụm (T); `B_mm` = chiều rộng vòng trong (B)

> ⚠ **Lưu ý 322xx:** Kích thước T của dòng 322xx trong ISO 355 có thể chưa chính xác với thiết kế Koyo (T Koyo và FAG/SKF đôi khi khác nhau cho cùng ký hiệu ISO). Tất cả đều đã đặt `confidence_override: "manual_review"`. **Bắt buộc đối chiếu catalog chính thức** trước khi báo giá.

### 2.3 koyo_cylindrical_roller_web_import.json – 56 mã

| Kiểu | Dòng | Số mã | Ghi chú |
|------|------|-------|---------|
| NU | NU202–NU215 | 14 | Tải hướng kính thuần túy |
| NU | NU302–NU315 | 13 | Series nặng |
| NJ | NJ202–NJ212 | 9 | Vành chặn một phía (tải trục một chiều) |
| NJ | NJ305–NJ312 | 6 | Series nặng |
| NUP | NUP204–NUP212 | 8 | Vành chặn hai phía trên vòng trong |
| NUP | NUP305–NUP312 | 6 | Series nặng |

- **Nguồn kích thước:** ISO 492 (d, D, B đồng nhất cho NU/NJ/NUP cùng mã số)
- **Lưu ý:** NJ và NUP có d, D, B giống NU tương ứng (khác nhau ở cấu tạo vành chặn, không ảnh hưởng kích thước lắp ghép)

---

## 3. Thay đổi code

### 3.1 `src/lib/product-search.ts`

**Fix 1 – mapProductGroup:**
```ts
// Trước: tất cả Koyo → "Gối đỡ / vòng bi"
if (brand === "Koyo") {
  return "Gối đỡ / vòng bi";
}

// Sau: chỉ Koyo Bearing Units (UC/UCP/UCF/UCFL) → "Gối đỡ / vòng bi"
// Các nhóm vòng bi mới sẽ rơi vào "Vòng bi"
if (brand === "Koyo" && clues.includes("UNIT")) {
  return "Gối đỡ / vòng bi";
}
```

**Fix 2 – confidence_override:**
```ts
// Thêm trước vòng lặp familyItems:
const rawConfidenceOverride = toStr(product.confidence_override);
const confidenceOverride: VariantConfidence | null =
  rawConfidenceOverride === "manual_review" || rawConfidenceOverride === "suggested"
    ? (rawConfidenceOverride as VariantConfidence)
    : null;

// Trong map familyItems:
const computedConfidence = classifyConfidence({...});
const confidence = confidenceOverride ?? computedConfidence;
```

### 3.2 `src/components/forms/multi-brand-product-lookup.tsx`

Thêm hai banner thông báo khi `brand === "Koyo"`:
- **Banner xanh** (empty query): thông báo Koyo hiện có dữ liệu UC/UCP/UCF/UCFL, nhóm 60xx/62xx/63xx đang bổ sung
- **Banner vàng** (query bắt đầu bằng `6[023]`): cảnh báo chưa có dữ liệu nhóm phổ thông

> ⚠ **Việc cần làm sau khi data live:** Khi 3 file dữ liệu mới đã được index và search trả về kết quả cho 6205/6206 v.v., banner vàng cho prefix `60xx/62xx/63xx` có thể xóa hoặc thay bằng banner thông tin nhẹ hơn (không còn "chưa có data"). Regex hiện tại: `/^6[023]/i`.

---

## 4. Hướng dẫn xác minh (static trace)

### Test 1: Tìm 6205 với brand=Koyo
- Indexer đọc `koyo_deep_groove_web_import.json` → tìm record `product_code: "6205"`
- `d_mm: 25, D_mm: 52, B_mm: 15` → index đúng dimension
- `confidence_override: "manual_review"` → `confidence = "manual_review"`
- `product_group: "Koyo Deep Groove Ball Bearings"` → không có "UNIT" → `mapProductGroup` → `"Vòng bi"` ✓
- Kết quả UI: thẻ "Vòng bi", badge vàng "Cần xác minh"

### Test 2: Tìm UCP205 với brand=Koyo
- Indexer đọc `koyo_bearing_units_web_import.json` → record `product_code: "UCP205"`
- `product_group: "Koyo Bearing Units"` → "UNIT" có trong clues → `"Gối đỡ / vòng bi"` ✓
- `confidence_override` không có → `classifyConfidence()` → kết quả theo logic gốc ✓

### Test 3: Tìm NU205 với brand=Koyo
- Indexer đọc `koyo_cylindrical_roller_web_import.json` → record `product_code: "NU205"`
- `d_mm: 25, D_mm: 52, B_mm: 15` → khớp dimension filter ✓
- `confidence_override: "manual_review"` → badge vàng ✓
- `product_group: "Koyo Cylindrical Roller Bearings"` → không UNIT → `"Vòng bi"` ✓

---

## 5. Việc cần làm tiếp theo

- [ ] Khi có catalog chính thức Koyo/JTEKT: xác minh lại B/T của dòng 322xx
- [ ] Khi search 6205/6307 trả kết quả: xem xét điều chỉnh hoặc xóa banner vàng trong `multi-brand-product-lookup.tsx`
- [ ] Xem xét bổ sung thêm mã NU216/NU217/NU218 (d 80–90mm) nếu khách hàng có nhu cầu
- [ ] Kiểm tra xem `koyo_bearing_units_web_import.json` có dùng `confidence_override` không; nếu không thì confidence vẫn theo logic `classifyConfidence()` (OK)
