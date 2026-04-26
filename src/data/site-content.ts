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
  clientSends: string;
  weSupport: string;
  clientGets: string;
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
  eyebrow: "Hỗ trợ vật tư truyền động cho nhà máy",
  heading: "Tra mã – Đối chiếu – Báo giá nhanh cho bảo trì & thay thế",
  subheading:
    "Dành cho bộ phận bảo trì, kỹ thuật, mua hàng và chủ xưởng cần xử lý thay thế vòng bi, gối đỡ, xích, dây curoa, phớt chặn dầu – đúng mã, đúng cụm máy, không chờ lâu.",
};

export const trustBullets = [
  "Giảm rủi ro đặt sai mã ngay từ bước đối chiếu đầu tiên",
  "Phản hồi trong ngày cho nhu cầu thay thế ảnh hưởng sản xuất",
  "Phối hợp được giữa bảo trì – kỹ thuật – mua hàng cùng nhà máy",
  "Gợi ý theo điều kiện vận hành thực tế, không chỉ gửi giá",
];

export const heroHighlights = [
  "Cần đối chiếu mã gấp theo tem cũ hoặc cụm máy đang dừng",
  "Chưa rõ cụm nào cần thay – cần tư vấn theo hiện trạng",
  "Cần phương án tương đương phù hợp tải, nhiệt, môi trường vận hành",
];

export const supportCards: SupportService[] = [
  {
    title: "Đối chiếu mã theo cụm máy",
    clientSends: "Gửi mã cũ, ảnh tem hoặc kích thước",
    weSupport: "Đối chiếu theo catalog và ứng dụng thực tế",
    clientGets: "Mã chính xác, giảm rủi ro đặt sai",
  },
  {
    title: "Tư vấn chọn hàng theo vận hành",
    clientSends: "Mô tả cụm máy, tải, nhiệt, môi trường",
    weSupport: "Phân tích điều kiện và gợi ý nhóm hàng phù hợp",
    clientGets: "Phương án đúng ứng dụng, không thừa không thiếu",
  },
  {
    title: "Xử lý gấp khi máy dừng",
    clientSends: "Tình trạng thiết bị, mốc thời gian cần hàng",
    weSupport: "Ưu tiên đối chiếu nhanh, đề xuất hàng tương đương",
    clientGets: "Phương án thay thế ngay, giảm thời gian chờ",
  },
  {
    title: "Phối hợp nội bộ nhà máy",
    clientSends: "Nhu cầu từ bảo trì hoặc kỹ thuật",
    weSupport: "Tách rõ phần kỹ thuật và phần đặt hàng",
    clientGets: "Thông tin gọn, mua hàng dễ kiểm tra và xử lý",
  },
  {
    title: "Tiếp nhận báo giá nhanh",
    clientSends: "Danh sách mã hoặc nhu cầu cụ thể",
    weSupport: "Ưu tiên các trường hợp ảnh hưởng tiến độ",
    clientGets: "Báo giá theo tình huống, không chờ quy trình dài",
  },
  {
    title: "Định hướng nhóm hàng phù hợp",
    clientSends: "Ngân sách, tiến độ, yêu cầu chất lượng",
    weSupport: "Cân đối giữa độ ổn định, thời gian giao và chi phí",
    clientGets: "Phương án phù hợp thực tế, không bị oversell",
  },
];

export const productGroups: ProductGroup[] = [
  {
    slug: "ntn",
    name: "NTN",
    shortDescription: "Vòng bi Nhật NTN là nhóm chủ đạo cho nhà máy cần độ ổn định, mã rõ và khả năng đối chiếu nhanh khi bảo trì.",
    detailDescription:
      "Ưu tiên NTN cho các cụm quay cần vận hành liên tục, dễ truy xuất mã cũ và cần phương án thay thế đáng tin cậy trong môi trường công nghiệp.",
    popularApplications: ["Động cơ điện", "Máy bơm", "Quạt công nghiệp", "Hộp số", "Trục quay", "Con lăn"],
    commonBuyers: ["Bộ phận bảo trì", "Kỹ thuật nhà máy", "Mua hàng kỹ thuật", "Xưởng cơ khí trong KCN"],
  },
  {
    slug: "koyo",
    name: "Koyo",
    shortDescription:
      "Koyo phù hợp cho vòng bi, gối đỡ và cụm đỡ trục trong dây chuyền cần độ bền ổn định.",
    detailDescription:
      "Dùng Koyo như nhóm bổ sung mạnh bên cạnh NTN, nhất là khi cần đối chiếu vòng bi, gối đỡ hoặc mã thay thế cho cụm máy đang vận hành.",
    popularApplications: ["Băng tải", "Trục truyền động", "Cụm đỡ trong dây chuyền", "Máy đóng gói", "Motor", "Hộp số"],
    commonBuyers: ["Bảo trì nhà máy", "Kỹ thuật dây chuyền", "Xưởng cơ khí", "Nhà thầu lắp đặt"],
  },
  {
    slug: "tsubaki",
    name: "Tsubaki",
    shortDescription: "Tsubaki tập trung cho xích công nghiệp, truyền động băng tải và các cơ cấu chạy tải liên tục.",
    detailDescription:
      "Phù hợp cho các dây chuyền cần xích truyền động ổn định, đối chiếu theo bước xích, số mắt, tải và điều kiện làm việc thực tế.",
    popularApplications: ["Băng tải xích", "Dây chuyền chuyển phôi", "Máy đóng gói", "Cơ cấu truyền động", "Nhông xích"],
    commonBuyers: ["Bảo trì dây chuyền", "Kỹ thuật nhà máy", "Xưởng chế tạo máy", "Nhà thầu cơ điện"],
  },
  {
    slug: "soho",
    name: "Soho",
    shortDescription: "Soho là nhóm vật tư truyền động bổ sung, dùng khi cần phương án phù hợp ngân sách và tiến độ thay thế.",
    detailDescription:
      "Dùng Soho như lựa chọn bổ sung trong danh mục, cần đối chiếu theo mã thực tế, vị trí lắp và yêu cầu vận hành trước khi chốt báo giá.",
    popularApplications: ["Vật tư truyền động", "Cụm thay thế định kỳ", "Máy sản xuất", "Dây chuyền phụ trợ"],
    commonBuyers: ["Mua hàng kỹ thuật", "Bảo trì nhà máy", "Xưởng cơ khí", "Khách thay thế định kỳ"],
  },
];

export const customerSegments: CustomerSegment[] = [
  {
    name: "Nhà máy sản xuất",
    summary: "Cần vật tư thay thế ổn định để duy trì tiến độ vận hành và hạn chế dừng máy.",
  },
  {
    name: "Bộ phận bảo trì",
    summary: "Cần đối chiếu mã nhanh, rõ ứng dụng và có phương án xử lý khi vật tư hỏng đột xuất.",
  },
  {
    name: "Bộ phận kỹ thuật",
    summary: "Cần đầu mối hiểu sản phẩm để trao đổi theo cụm máy, tải và điều kiện làm việc thực tế.",
  },
  {
    name: "Bộ phận mua hàng",
    summary: "Cần thông tin mã rõ, mô tả dễ kiểm tra và phản hồi nhanh để xử lý đề nghị mua.",
  },
  {
    name: "Xưởng cơ khí trong KCN",
    summary: "Cần vật tư truyền động và đỡ trục phù hợp cho máy chạy liên tục và tải thực tế.",
  },
  {
    name: "Xưởng chế tạo máy",
    summary: "Cần chọn đúng quy cách ngay từ đầu để giảm sửa đổi trong quá trình lắp máy.",
  },
  {
    name: "Nhà thầu cơ điện / lắp đặt công nghiệp",
    summary: "Cần đối chiếu nhanh mã hàng theo hồ sơ, hiện trường và tiến độ thi công.",
  },
  {
    name: "Khách công nghiệp cần thay thế định kỳ",
    summary: "Cần nguồn hỗ trợ ổn định để phục vụ bảo trì theo kế hoạch tháng, quý, năm.",
  },
];

export const whyContactBullets = [
  "Giảm rủi ro đặt sai mã – đối chiếu trước khi đặt hàng",
  "Phối hợp thuận lợi giữa bảo trì, kỹ thuật và mua hàng",
  "Có phương án theo ứng dụng thực tế, không chỉ tra giá",
  "Xử lý nhanh các tình huống thay thế đang ảnh hưởng sản xuất",
  "Gửi mã, ảnh, kích thước qua Zalo – tiếp nhận ngay",
];

export const whyContactDescription =
  "Mục tiêu: giúp xác định đúng mã, đúng cụm, đúng phương án – để nội bộ nhà máy xác nhận nhanh và đặt hàng không mất thêm thời gian.";

export const supportProcess = [
  "Gửi mã cũ, ảnh tem, ảnh cụm máy hoặc kích thước đang có",
  "Đối chiếu nhanh theo ứng dụng, catalog và điều kiện vận hành",
  "Xác nhận nhóm hàng phù hợp – mã chính hoặc phương án tương đương",
  "Chuyển xử lý báo giá, xác nhận số lượng và theo dõi tiến độ",
];

export const supportProcessNote =
  "Gửi càng rõ thông tin cụm máy, mã cũ hoặc hình ảnh tem → xử lý càng nhanh, giảm trao đổi qua lại.";

export const solutionByCustomer: CustomerSolution[] = [
  {
    customer: "Nhà máy sản xuất",
    problems: "Dừng máy đột xuất ảnh hưởng trực tiếp đến kế hoạch sản xuất.",
    support: "Ưu tiên đối chiếu mã nhanh theo cụm máy và điều kiện vận hành thực tế.",
    products: "Vòng bi, gối đỡ, xích công nghiệp, mỡ bôi trơn",
  },
  {
    customer: "Bộ phận bảo trì",
    problems: "Cần xử lý sự cố nhanh nhưng dữ liệu mã cũ không đầy đủ.",
    support: "Đối chiếu theo ảnh tem, kích thước, hiện trạng và lịch sử thay thế gần nhất.",
    products: "Vòng bi, phớt chặn dầu, mỡ bôi trơn",
  },
  {
    customer: "Bộ phận kỹ thuật",
    problems: "Cần xác nhận đúng phương án theo tải, nhiệt, bụi và thời gian chạy máy.",
    support: "Tư vấn theo thông số vận hành để giảm rủi ro chọn sai mã.",
    products: "Vòng bi, gối đỡ, dây curoa, xích công nghiệp",
  },
  {
    customer: "Bộ phận mua hàng",
    problems: "Cần thông tin mã rõ để xử lý đề nghị mua và so sánh phương án nhanh.",
    support: "Hỗ trợ tách rõ thông tin kỹ thuật và thông tin đặt hàng cho từng nhóm vật tư.",
    products: "Vòng bi, gối đỡ, dây curoa, phớt chặn dầu",
  },
  {
    customer: "Xưởng cơ khí trong KCN",
    problems: "Máy chạy theo ca, vật tư chịu tải thực tế cao và cần thay đúng chuẩn.",
    support: "Định hướng nhóm hàng theo vị trí máy, mức tải và điều kiện làm việc.",
    products: "Vòng bi, gối đỡ, xích công nghiệp",
  },
  {
    customer: "Xưởng chế tạo máy",
    problems: "Sai quy cách từ đầu dẫn đến chỉnh sửa lắp ráp và tăng thời gian hoàn thiện máy.",
    support: "Đối chiếu sớm theo bản vẽ, cụm lắp và vật tư tương thích.",
    products: "Gối đỡ, vòng bi, xích công nghiệp, phớt chặn dầu",
  },
  {
    customer: "Nhà thầu cơ điện / lắp đặt công nghiệp",
    problems: "Tiến độ hiện trường yêu cầu phản hồi nhanh và mã hàng rõ ràng theo hồ sơ.",
    support: "Hỗ trợ đối chiếu theo hiện trạng và khối lượng thi công theo giai đoạn.",
    products: "Vòng bi, gối đỡ, dây curoa, xích công nghiệp",
  },
  {
    customer: "Khách công nghiệp cần thay thế định kỳ",
    problems: "Cần nguồn hỗ trợ ổn định cho kế hoạch bảo trì tháng, quý, năm.",
    support: "Theo dõi nhu cầu thay thế định kỳ và gợi ý nhóm hàng theo chu kỳ vận hành.",
    products: "Vòng bi, mỡ bôi trơn, phớt chặn dầu, dây curoa",
  },
];

export const leadFormIntro =
  "Anh/chị có thể gửi mã cũ, ảnh tem, ảnh vị trí lắp, kích thước hoặc mô tả thiết bị để hỗ trợ đối chiếu nhanh hơn.";

export type CustomerRole = {
  role: string;
  problems: string;
  support: string;
};

export const customerRoles: CustomerRole[] = [
  {
    role: "Bảo trì nhà máy",
    problems: "Máy hỏng đột xuất, mã cũ mờ hoặc thiếu, cần xử lý gấp trong ngày để không ảnh hưởng sản xuất.",
    support: "Đối chiếu mã theo ảnh tem, kích thước, hiện trạng – đề xuất phương án thay thế nhanh nhất.",
  },
  {
    role: "Kỹ thuật thiết bị",
    problems: "Cần xác nhận đúng thông số theo tải, tốc độ, nhiệt và môi trường để tránh chọn sai mã.",
    support: "Tư vấn theo thông số vận hành thực tế, đối chiếu catalog và gợi ý nhóm hàng phù hợp cụm máy.",
  },
  {
    role: "Mua hàng kỹ thuật",
    problems: "Thông tin mã từ bảo trì / kỹ thuật không rõ, cần xác nhận nhanh để xử lý đề nghị mua.",
    support: "Tách rõ thông tin kỹ thuật – thông tin đặt hàng, giúp kiểm tra và so sánh phương án dễ hơn.",
  },
  {
    role: "Chủ xưởng / Cơ điện",
    problems: "Máy chạy liên tục theo ca, vật tư chịu tải nặng, cần nguồn hỗ trợ kỹ thuật ổn định lâu dài. Thường tự xử lý sửa chữa nhưng khó tìm đúng mã thay thế khi hàng cũ hết hoặc đổi quy cách.",
    support: "Định hướng nhóm hàng theo vị trí máy, mức tải thực tế và điều kiện vận hành dài hạn. Hỗ trợ đối chiếu mã tương đương khi hàng gốc không còn, gợi ý phương án phù hợp ngân sách và tiến độ xưởng.",
  },
];

export const leadFormUploadHint =
  "Anh/chị có thể gửi ảnh tem, ảnh mẫu cũ hoặc ảnh vị trí lắp để hỗ trợ đối chiếu nhanh hơn.";

export const leadFormBottomNote =
  "Ưu tiên xử lý nhanh các trường hợp cần thay thế để đảm bảo tiến độ vận hành hoặc bảo trì.";

export const quoteGuideBullets = [
  "Gửi trước mã cũ, ảnh tem, kích thước hoặc mô tả cụm máy để rút ngắn thời gian đối chiếu.",
  "Nếu cần xử lý gấp, nên ghi rõ mức độ ưu tiên và mốc thời gian cần vật tư.",
  "Thông tin kỹ thuật rõ ràng giúp bộ phận mua hàng kiểm tra và đặt hàng nhanh hơn.",
  "Có thể gửi qua Zalo trước, sau đó điền form để lưu đầy đủ dữ liệu theo từng yêu cầu.",
];
