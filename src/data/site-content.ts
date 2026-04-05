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
  eyebrow: "Kênh tư vấn vật tư kỹ thuật cho nhà máy và khách công nghiệp",
  heading: "Hỗ trợ tra mã, tư vấn và báo giá vật tư truyền động cho nhà máy trong khu công nghiệp",
  subheading:
    "Tập trung các nhóm hàng phục vụ bảo trì và thay thế trong nhà máy: vòng bi, gối đỡ, dây curoa, xích công nghiệp, phớt chặn dầu và mỡ bôi trơn. Ưu tiên nhu cầu cần xử lý nhanh, đúng mã và phù hợp điều kiện vận hành thực tế.",
};

export const trustBullets = [
  "Hỗ trợ đối chiếu mã theo cụm máy và ứng dụng thực tế",
  "Ưu tiên nhu cầu thay thế để giảm thời gian dừng máy",
  "Phù hợp cho bộ phận bảo trì, kỹ thuật và mua hàng",
  "Gợi ý phương án hàng theo tiến độ, mức tải và môi trường làm việc",
];

export const heroHighlights = [
  "Tiếp nhận nhu cầu trong ngày",
  "Bám mã, bám ứng dụng, bám tiến độ",
  "Ưu tiên nhóm khách nhà máy và xưởng sản xuất",
];

export const supportCards: SupportService[] = [
  {
    title: "Tra mã theo cụm máy và mã cũ",
    description: "Đối chiếu theo mã đang dùng, ảnh tem, kích thước hoặc vị trí lắp để hạn chế đặt sai.",
  },
  {
    title: "Tư vấn chọn hàng theo điều kiện vận hành",
    description: "Ưu tiên theo tải, nhiệt, bụi, độ ẩm, tốc độ quay và thời gian làm việc của thiết bị.",
  },
  {
    title: "Gợi ý phương án thay thế khi cần xử lý gấp",
    description: "Hỗ trợ các trường hợp cần ra phương án nhanh để giảm thời gian chờ vật tư.",
  },
  {
    title: "Phối hợp theo nhu cầu của bảo trì và mua hàng",
    description: "Hỗ trợ tách rõ phần kỹ thuật và phần đặt hàng để làm việc nhanh hơn trong nội bộ nhà máy.",
  },
  {
    title: "Tiếp nhận nhu cầu báo giá theo tình huống thực tế",
    description: "Ưu tiên các trường hợp cần xử lý trong ngày hoặc đang ảnh hưởng tiến độ sản xuất.",
  },
  {
    title: "Định hướng nhóm hàng phù hợp theo tiến độ và ngân sách",
    description: "Cân đối giữa độ ổn định, thời gian cần hàng và mức đầu tư của từng vị trí máy.",
  },
];

export const productGroups: ProductGroup[] = [
  {
    slug: "vong-bi",
    name: "Vòng bi",
    shortDescription: "Đối chiếu mã vòng bi theo tải, tốc độ quay, môi trường bụi nhiệt và cụm máy đang sử dụng.",
    detailDescription:
      "Phù hợp cho các hệ truyền động và cụm quay cần vận hành ổn định trong nhà máy chạy theo ca.",
    popularApplications: ["Động cơ điện", "Máy bơm", "Quạt công nghiệp", "Hộp số", "Trục quay", "Con lăn"],
    commonBuyers: ["Nhà máy sản xuất", "Bộ phận bảo trì", "Bộ phận kỹ thuật", "Bộ phận mua hàng"],
  },
  {
    slug: "goi-do",
    name: "Gối đỡ",
    shortDescription:
      "Tư vấn gối đỡ theo đường kính trục, kiểu lắp, vị trí đỡ và điều kiện vận hành liên tục trong nhà xưởng.",
    detailDescription:
      "Ưu tiên phương án đồng bộ với cụm đỡ trục trong dây chuyền để giảm thời gian chỉnh sửa khi thay thế.",
    popularApplications: ["Băng tải", "Trục truyền động", "Cụm đỡ trong dây chuyền", "Máy đóng gói"],
    commonBuyers: ["Nhà máy sản xuất", "Bộ phận bảo trì", "Xưởng cơ khí trong KCN", "Xưởng chế tạo máy"],
  },
  {
    slug: "day-curoa",
    name: "Dây curoa",
    shortDescription: "Gợi ý dây theo profile, chiều dài, tải làm việc và tốc độ vận hành của thiết bị.",
    detailDescription:
      "Tập trung cho các cụm truyền động phụ cần thay thế định kỳ để giữ ổn định tiến độ sản xuất.",
    popularApplications: ["Quạt công nghiệp", "Máy nén khí", "Máy dệt", "Máy đóng gói", "Hệ truyền động phụ"],
    commonBuyers: ["Nhà máy sản xuất", "Bộ phận bảo trì", "Bộ phận kỹ thuật", "Khách công nghiệp thay thế định kỳ"],
  },
  {
    slug: "xich-cong-nghiep",
    name: "Xích công nghiệp",
    shortDescription: "Đối chiếu bước xích, số mắt, tải và môi trường làm việc để chọn đúng phương án thay thế.",
    detailDescription:
      "Ưu tiên các hệ thống băng tải và cơ cấu truyền động cần xử lý nhanh để giảm thời gian dừng thiết bị.",
    popularApplications: ["Băng tải xích", "Máy sản xuất", "Dây chuyền chuyển phôi", "Cơ cấu truyền động"],
    commonBuyers: ["Nhà máy sản xuất", "Bộ phận bảo trì", "Nhà thầu cơ điện / lắp đặt công nghiệp", "Xưởng chế tạo máy"],
  },
  {
    slug: "phot-chan-dau",
    name: "Phớt chặn dầu",
    shortDescription: "Tư vấn theo kích thước trục - vỏ, vật liệu và yêu cầu giữ kín trong cụm máy.",
    detailDescription:
      "Tập trung cho các cụm quay, cụm kín dầu và cụm truyền động cần hạn chế rò rỉ trong vận hành liên tục.",
    popularApplications: ["Hộp số", "Cụm trục", "Bơm", "Motor giảm tốc", "Máy thủy lực"],
    commonBuyers: ["Bộ phận bảo trì", "Bộ phận kỹ thuật", "Nhà máy sản xuất", "Xưởng chế tạo máy"],
  },
  {
    slug: "mo-boi-tron",
    name: "Mỡ bôi trơn",
    shortDescription: "Gợi ý mỡ theo nhiệt độ, tốc độ quay, tải và chu kỳ bảo trì của thiết bị.",
    detailDescription:
      "Phù hợp cho các cụm chạy liên tục theo ca, cần độ ổn định bôi trơn và kế hoạch bảo trì rõ ràng.",
    popularApplications: ["Vòng bi tốc độ cao", "Cụm con lăn", "Motor", "Quạt", "Cụm chạy liên tục theo ca"],
    commonBuyers: ["Bộ phận bảo trì", "Nhà máy sản xuất", "Xưởng cơ khí trong KCN", "Khách công nghiệp thay thế định kỳ"],
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
  "Giảm rủi ro sai mã ngay từ bước đối chiếu ban đầu",
  "Dễ làm việc khi cần trao đổi giữa bảo trì, kỹ thuật và mua hàng",
  "Có định hướng theo ứng dụng thực tế thay vì chỉ gửi giá",
  "Hỗ trợ nhanh các nhu cầu thay thế đang ảnh hưởng vận hành",
  "Thuận tiện gửi mã, ảnh, kích thước hoặc hiện trạng máy qua Zalo",
];

export const whyContactDescription =
  "Mục tiêu không chỉ là gửi báo giá, mà là giúp khách xác định đúng nhu cầu, đúng cụm chi tiết và đúng phương án xử lý để giảm mất thời gian trong quá trình nội bộ nhà máy xác nhận và đặt hàng.";

export const supportProcess = [
  "Gửi mã, ảnh, kích thước hoặc mô tả cụm máy",
  "Tiếp nhận và đối chiếu theo thông tin kỹ thuật thực tế",
  "Đề xuất mã phù hợp hoặc phương án tương đương nếu cần xử lý gấp",
  "Chuyển sang bước báo giá, xác nhận và theo dõi nhu cầu",
];

export const supportProcessNote =
  "Thông tin càng rõ về cụm máy, mã cũ, kích thước hoặc hình ảnh thực tế thì thời gian hỗ trợ càng nhanh và chính xác.";

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
