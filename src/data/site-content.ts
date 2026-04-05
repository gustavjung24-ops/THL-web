export type ProductGroup = {
  slug: string;
  name: string;
  shortDescription: string;
  detailDescription: string;
  popularApplications: string[];
  commonBuyers: string[];
};

export type SupportService = {
  title: string;
  description: string;
};

export type CustomerSegment = {
  name: string;
  summary: string;
};

export type CustomerSolution = {
  customer: string;
  problems: string;
  support: string;
  products: string;
};

export const heroContent = {
  heading: "Hỗ trợ tra mã, tư vấn và báo giá phụ tùng công nghiệp theo đúng nhu cầu",
  subheading:
    "Tập trung các nhóm hàng: vòng bi, gối đỡ, dây curoa, xích công nghiệp, phớt chặn dầu và mỡ bôi trơn cho cửa hàng, gara, xưởng và khách công nghiệp nhỏ.",
};

export const trustBullets = [
  "Hỗ trợ chọn đúng mã",
  "Gợi ý hàng phù hợp ứng dụng",
  "Tiếp nhận nhu cầu nhanh",
  "Hỗ trợ khách thương mại và khách công nghiệp nhỏ",
];

export const supportCards: SupportService[] = [
  {
    title: "Tra mã vòng bi và phụ tùng",
    description: "Đối chiếu mã theo thông tin thực tế để hạn chế đặt sai ngay từ đầu.",
  },
  {
    title: "Tư vấn chọn hàng theo ứng dụng",
    description: "Ưu tiên theo điều kiện vận hành, môi trường làm việc và mức tải.",
  },
  {
    title: "Gợi ý hàng tương đương khi cần thay gấp",
    description: "Đề xuất phương án thay thế để xử lý nhanh khi cần ra hàng ngay.",
  },
  {
    title: "Hỗ trợ khách thương mại và xưởng nhỏ",
    description: "Linh hoạt theo quy mô đơn hàng và tần suất mua thực tế.",
  },
  {
    title: "Tiếp nhận nhu cầu báo giá nhanh",
    description: "Ưu tiên các trường hợp cần chốt phương án trong ngày.",
  },
  {
    title: "Gợi ý nhóm hàng phù hợp với ngân sách",
    description: "Cân đối giữa nhu cầu vận hành, tiến độ và chi phí.",
  },
];

export const productGroups: ProductGroup[] = [
  {
    slug: "vong-bi",
    name: "Vòng bi",
    shortDescription: "Hỗ trợ đối chiếu mã vòng bi theo tải, tốc độ và môi trường làm việc.",
    detailDescription:
      "Nhóm hàng thường gặp trong động cơ, cụm trục quay và hệ truyền động cần độ ổn định cao.",
    popularApplications: ["Động cơ điện", "Cụm trục quay", "Máy bơm"],
    commonBuyers: ["Gara", "Xưởng cơ khí", "Đại lý vật tư"],
  },
  {
    slug: "goi-do",
    name: "Gối đỡ",
    shortDescription: "Tư vấn gối đỡ theo trục, tải trọng và không gian lắp đặt tại xưởng.",
    detailDescription:
      "Tập trung các mã gối đỡ dùng cho băng tải, cụm truyền động và dây chuyền đóng gói.",
    popularApplications: ["Băng tải", "Trục truyền động", "Máy đóng gói"],
    commonBuyers: ["Xưởng chế tạo", "Khách công nghiệp nhỏ", "Cơ điện"],
  },
  {
    slug: "day-curoa",
    name: "Dây curoa",
    shortDescription: "Gợi ý dây curoa theo chiều dài, profile và điều kiện vận hành.",
    detailDescription:
      "Phù hợp cho các hệ truyền động trong quạt công nghiệp, máy nén khí và máy dệt.",
    popularApplications: ["Quạt công nghiệp", "Máy nén khí", "Máy dệt"],
    commonBuyers: ["Ngành may", "Xưởng cơ khí", "Cửa hàng phụ tùng ô tô"],
  },
  {
    slug: "xich-cong-nghiep",
    name: "Xích công nghiệp",
    shortDescription: "Đối chiếu bước xích, số mắt xích và tải làm việc để thay đúng mã.",
    detailDescription:
      "Ưu tiên các hệ thống băng tải xích, dây chuyền sản xuất cần thay nhanh để giảm dừng máy.",
    popularApplications: ["Băng tải xích", "Hệ truyền động", "Máy sản xuất"],
    commonBuyers: ["Xưởng chế tạo", "Cơ điện", "Khách công nghiệp nhỏ"],
  },
  {
    slug: "phot-chan-dau",
    name: "Phớt chặn dầu",
    shortDescription: "Tư vấn phớt theo kích thước trục - vỏ, vật liệu và môi trường vận hành.",
    detailDescription:
      "Phù hợp cho các cụm trục, hộp số và hệ thống có yêu cầu giữ kín dầu mỡ ổn định.",
    popularApplications: ["Hộp số", "Cụm trục", "Máy thủy lực"],
    commonBuyers: ["Gara ô tô", "Xưởng cơ khí", "Cửa hàng phụ tùng xe máy"],
  },
  {
    slug: "mo-boi-tron",
    name: "Mỡ bôi trơn",
    shortDescription: "Gợi ý mỡ bôi trơn theo nhiệt độ, tốc độ quay và chu kỳ bảo trì.",
    detailDescription:
      "Thường áp dụng cho vòng bi tốc độ cao, cụm con lăn và các cụm máy làm việc liên tục.",
    popularApplications: ["Vòng bi tốc độ cao", "Máy ép", "Cụm con lăn"],
    commonBuyers: ["Gara", "Đại lý vật tư", "Khách công nghiệp nhỏ"],
  },
];

export const customerSegments: CustomerSegment[] = [
  {
    name: "Cửa hàng phụ tùng xe máy",
    summary: "Cần đối chiếu mã nhanh theo nhu cầu thay thế thực tế của khách lẻ.",
  },
  {
    name: "Cửa hàng phụ tùng ô tô",
    summary: "Thường xử lý nhiều phương án mã cho cùng một cụm chi tiết.",
  },
  {
    name: "Gara ô tô",
    summary: "Ưu tiên tiến độ sửa chữa và dễ thay lắp theo tình trạng xe vào xưởng.",
  },
  {
    name: "Xưởng cơ khí",
    summary: "Cần vật tư truyền động ổn định để giảm thời gian dừng máy.",
  },
  {
    name: "Xưởng chế tạo",
    summary: "Cần chọn đúng quy cách ngay từ đầu để tránh chỉnh sửa nhiều lần.",
  },
  {
    name: "Ngành may",
    summary: "Ưu tiên vật tư chạy ổn định theo ca, dễ thay bảo trì theo lịch.",
  },
  {
    name: "Cơ điện",
    summary: "Cần hỗ trợ đối chiếu mã theo hồ sơ và điều kiện thi công thực tế.",
  },
  {
    name: "Khách công nghiệp nhỏ",
    summary: "Cần người đồng hành từ bước tiếp nhận thông tin đến báo giá.",
  },
  {
    name: "Đại lý vật tư",
    summary: "Cần nguồn tư vấn ổn định để phục vụ đơn lẻ theo từng khu vực.",
  },
];

export const whyContactBullets = [
  "Giảm sai mã ngay từ đầu",
  "Dễ đối chiếu theo ảnh, mã cũ hoặc kích thước",
  "Có định hướng theo ứng dụng thực tế",
  "Dễ trao đổi nhanh qua Zalo/điện thoại",
  "Phù hợp cho khách cần xử lý nhu cầu gấp",
];

export const supportProcess = [
  "Khách gửi mã, ảnh hoặc nhu cầu",
  "Tôi tiếp nhận và đối chiếu thông tin",
  "Gợi ý mã phù hợp hoặc phương án tương đương",
  "Chuyển sang bước báo giá / xác nhận nhu cầu",
];

export const solutionByCustomer: CustomerSolution[] = [
  {
    customer: "Cửa hàng phụ tùng xe máy",
    problems: "Khách cần thay nhanh nhưng mã cũ thường mờ hoặc thiếu thông tin.",
    support: "Đối chiếu theo ảnh mẫu cũ, kích thước và tình trạng thực tế của xe.",
    products: "Vòng bi, phớt chặn dầu, mỡ bôi trơn",
  },
  {
    customer: "Cửa hàng phụ tùng ô tô",
    problems: "Một cụm chi tiết có thể có nhiều đời mã và tiêu chuẩn khác nhau.",
    support: "Gợi ý phương án mã phù hợp để dễ tư vấn lại cho khách cuối.",
    products: "Vòng bi, phớt chặn dầu, dây curoa",
  },
  {
    customer: "Gara ô tô",
    problems: "Xe nằm xưởng cần xử lý nhanh để trả xe đúng hẹn.",
    support: "Tư vấn phương án ưu tiên tính sẵn hàng và dễ thi công.",
    products: "Dây curoa, phớt chặn dầu, mỡ bôi trơn",
  },
  {
    customer: "Xưởng cơ khí",
    problems: "Máy vận hành liên tục nên việc dừng máy gây chi phí cao.",
    support: "Định hướng mã theo tải trọng và môi trường làm việc thực tế.",
    products: "Vòng bi, gối đỡ, xích công nghiệp",
  },
  {
    customer: "Xưởng chế tạo",
    problems: "Cần chọn vật tư đúng thông số từ đầu để hạn chế đổi trả.",
    support: "Hỗ trợ bám theo thông số trục, tải và tần suất hoạt động.",
    products: "Gối đỡ, xích công nghiệp, dây curoa",
  },
  {
    customer: "Ngành may",
    problems: "Cần cụm truyền động ổn định để đảm bảo tiến độ sản xuất.",
    support: "Tư vấn dây curoa và vòng bi theo lịch bảo trì từng chuyền máy.",
    products: "Dây curoa, vòng bi, mỡ bôi trơn",
  },
  {
    customer: "Cơ điện",
    problems: "Thông tin mã nằm rải rác ở nhiều hệ thống và hồ sơ khác nhau.",
    support: "Tổng hợp dữ liệu nhanh và đề xuất phương án thay thế dễ triển khai.",
    products: "Gối đỡ, xích công nghiệp, vòng bi",
  },
  {
    customer: "Khách công nghiệp nhỏ",
    problems: "Thường không có bộ phận vật tư riêng để xử lý mã hàng.",
    support: "Đồng hành từ bước tiếp nhận thông tin đến báo giá và xác nhận nhu cầu.",
    products: "6 nhóm hàng cơ bản theo ứng dụng",
  },
  {
    customer: "Đại lý vật tư",
    problems: "Cần nguồn tư vấn mã ổn định để xử lý đơn nhỏ lẻ hằng ngày.",
    support: "Hỗ trợ tra mã và gợi ý nhóm hàng theo nhu cầu từng khu vực.",
    products: "Vòng bi, gối đỡ, phớt chặn dầu",
  },
];

export const leadFormNote =
  "Anh/chị có thể gửi ảnh tem, ảnh mẫu cũ hoặc ảnh vị trí lắp để hỗ trợ nhanh hơn.";

export const quoteGuideBullets = [
  "Gửi càng đủ mã, ảnh hoặc kích thước thì thời gian đối chiếu càng nhanh.",
  "Nếu chưa rõ mã, có thể gửi ảnh cụm máy hoặc ảnh vị trí lắp.",
  "Nhu cầu gấp nên ghi rõ thời gian cần hàng để ưu tiên xử lý.",
  "Có thể gửi trước qua Zalo, sau đó điền form để lưu thông tin đầy đủ.",
];
