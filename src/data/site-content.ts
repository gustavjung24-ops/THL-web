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
    slug: "vong-bi",
    name: "Vòng bi",
    shortDescription: "Dùng trong động cơ, bơm, quạt, hộp số. Hay thay khi ổ kêu, rung, nóng hoặc đến kỳ bảo trì. Bảo trì và kỹ thuật nhà máy hỏi nhiều nhất.",
    detailDescription:
      "Phù hợp cho các hệ truyền động và cụm quay cần vận hành ổn định trong nhà máy chạy theo ca.",
    popularApplications: ["Động cơ điện", "Máy bơm", "Quạt công nghiệp", "Hộp số", "Trục quay", "Con lăn"],
    commonBuyers: ["Bộ phận bảo trì", "Kỹ thuật nhà máy", "Mua hàng kỹ thuật", "Xưởng cơ khí trong KCN"],
  },
  {
    slug: "goi-do",
    name: "Gối đỡ",
    shortDescription:
      "Dùng trong băng tải, trục truyền động, dây chuyền đóng gói. Hay thay khi lỏng, lệch tâm hoặc kèm thay vòng bi. Bảo trì dây chuyền hỏi nhiều nhất.",
    detailDescription:
      "Ưu tiên phương án đồng bộ với cụm đỡ trục trong dây chuyền để giảm thời gian chỉnh sửa khi thay thế.",
    popularApplications: ["Băng tải", "Trục truyền động", "Cụm đỡ trong dây chuyền", "Máy đóng gói"],
    commonBuyers: ["Bảo trì nhà máy", "Kỹ thuật dây chuyền", "Xưởng cơ khí", "Nhà thầu lắp đặt"],
  },
  {
    slug: "day-curoa",
    name: "Dây curoa",
    shortDescription: "Dùng trong quạt, máy nén khí, hệ truyền động phụ. Hay thay khi trượt, nứt, giãn hoặc đến kỳ. Bảo trì và kỹ thuật nhà máy hỏi nhiều.",
    detailDescription:
      "Tập trung cho các cụm truyền động phụ cần thay thế định kỳ để giữ ổn định tiến độ sản xuất.",
    popularApplications: ["Quạt công nghiệp", "Máy nén khí", "Máy dệt", "Máy đóng gói", "Hệ truyền động phụ"],
    commonBuyers: ["Bảo trì", "Kỹ thuật thiết bị", "Nhà máy sản xuất", "Xưởng chế tạo"],
  },
  {
    slug: "xich-cong-nghiep",
    name: "Xích công nghiệp",
    shortDescription: "Dùng trong băng tải xích, dây chuyền sản xuất, cơ cấu truyền động. Hay thay khi giãn, mòn hoặc đứt mắt. Bảo trì dây chuyền hỏi nhiều nhất.",
    detailDescription:
      "Ưu tiên các hệ thống băng tải và cơ cấu truyền động cần xử lý nhanh để giảm thời gian dừng thiết bị.",
    popularApplications: ["Băng tải xích", "Máy sản xuất", "Dây chuyền chuyển phôi", "Cơ cấu truyền động"],
    commonBuyers: ["Bảo trì dây chuyền", "Kỹ thuật nhà máy", "Xưởng chế tạo máy", "Nhà thầu cơ điện"],
  },
  {
    slug: "phot-chan-dau",
    name: "Phớt chặn dầu",
    shortDescription: "Dùng trong hộp số, cụm trục, bơm, motor giảm tốc. Hay thay khi rò dầu, rỉ mỡ hoặc kèm theo thay vòng bi. Bảo trì và kỹ thuật hỏi nhiều.",
    detailDescription:
      "Tập trung cho các cụm quay, cụm kín dầu và cụm truyền động cần hạn chế rò rỉ trong vận hành liên tục.",
    popularApplications: ["Hộp số", "Cụm trục", "Bơm", "Motor giảm tốc", "Máy thủy lực"],
    commonBuyers: ["Bảo trì", "Kỹ thuật", "Nhà máy sản xuất", "Đơn vị sửa chữa công nghiệp"],
  },
  {
    slug: "mo-boi-tron",
    name: "Mỡ bôi trơn",
    shortDescription: "Dùng cho vòng bi, con lăn, motor, cụm quay liên tục. Hay dùng khi bổ sung định kỳ hoặc kèm thay vòng bi. Bảo trì nhà máy dùng nhiều nhất.",
    detailDescription:
      "Phù hợp cho các cụm chạy liên tục theo ca, cần độ ổn định bôi trơn và kế hoạch bảo trì rõ ràng.",
    popularApplications: ["Vòng bi tốc độ cao", "Cụm con lăn", "Motor", "Quạt", "Cụm chạy liên tục theo ca"],
    commonBuyers: ["Bảo trì nhà máy", "Kỹ thuật vận hành", "Khách thay thế định kỳ"],
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
    problems: "Máy chạy liên tục theo ca, vật tư chịu tải nặng, cần nguồn hỗ trợ kỹ thuật ổn định lâu dài.",
    support: "Định hướng nhóm hàng theo vị trí máy, mức tải thực tế và điều kiện vận hành dài hạn.",
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
