export type ProductGroup = {
  slug: string;
  name: string;
  shortDescription: string;
  popularApplications: string[];
  commonBuyers: string[];
};

export const trustBullets = [
  "Ho tro chon dung ma",
  "Goi y hang phu hop ung dung",
  "Tiep nhan nhu cau nhanh",
  "Ho tro khach thuong mai va khach cong nghiep nho",
];

export const supportCards = [
  "Tra ma vong bi va phu tung",
  "Tu van chon hang theo ung dung",
  "Goi y hang tuong duong khi can thay gap",
  "Ho tro khach thuong mai va xuong nho",
  "Tiep nhan nhu cau bao gia nhanh",
  "Goi y nhom hang phu hop voi ngan sach",
];

export const productGroups: ProductGroup[] = [
  {
    slug: "vong-bi",
    name: "Vong bi",
    shortDescription: "Ho tro doi chieu ma vong bi theo ung dung quay, tai trong va moi truong lam viec.",
    popularApplications: ["Dong co", "Cau truc truc quay", "May bom"],
    commonBuyers: ["Gara", "Xuong co khi", "Dai ly vat tu"],
  },
  {
    slug: "goi-do",
    name: "Goi do",
    shortDescription: "Tu van goi do dung loai theo truc, tai trong va dieu kien lap dat tai xuong.",
    popularApplications: ["Bang tai", "Truc chuyen dong", "May dong goi"],
    commonBuyers: ["Xuong che tao", "Khach cong nghiep nho", "Co dien"],
  },
  {
    slug: "day-curoa",
    name: "Day curoa",
    shortDescription: "Goi y day curoa theo thong so chieu dai, profile va toc do van hanh.",
    popularApplications: ["Quat cong nghiep", "May nen khi", "May det"],
    commonBuyers: ["Nganh may", "Xuong co khi", "Cua hang phu tung o to"],
  },
  {
    slug: "xich-cong-nghiep",
    name: "Xich cong nghiep",
    shortDescription: "Ho tro doi chieu buoc xich, so mat xich va dieu kien tai trong de thay the nhanh.",
    popularApplications: ["Bang tai xich", "He truyen dong", "May san xuat"],
    commonBuyers: ["Xuong che tao", "Co dien", "Khach cong nghiep nho"],
  },
  {
    slug: "phot-chan-dau",
    name: "Phot chan dau",
    shortDescription: "Tu van phot theo kich thuoc truc - vo, vat lieu va moi truong lam viec.",
    popularApplications: ["Hop so", "Cum truc", "May thuy luc"],
    commonBuyers: ["Gara o to", "Xuong co khi", "Cua hang phu tung xe may"],
  },
  {
    slug: "mo-boi-tron",
    name: "Mo boi tron",
    shortDescription: "Goi y mo boi tron theo nhiet do, toc do quay va che do bao tri tai xuan.",
    popularApplications: ["Vong bi toc do cao", "May ep", "Cum con lan"],
    commonBuyers: ["Gara", "Dai ly vat tu", "Khach cong nghiep nho"],
  },
];

export const customerSegments = [
  "Cua hang phu tung xe may",
  "Cua hang phu tung o to",
  "Gara o to",
  "Xuong co khi",
  "Xuong che tao",
  "Nganh may",
  "Co dien",
  "Khach cong nghiep nho",
  "Dai ly vat tu",
];

export const whyContactBullets = [
  "Giam sai ma ngay tu dau",
  "De doi chieu theo anh, ma cu hoac kich thuoc",
  "Co dinh huong theo ung dung thuc te",
  "De trao doi nhanh qua Zalo/dien thoai",
  "Phu hop cho khach can xu ly nhu cau gap",
];

export const supportProcess = [
  "Khach gui ma, anh hoac nhu cau",
  "Toi tiep nhan va doi chieu thong tin",
  "Goi y ma phu hop hoac phuong an tuong duong",
  "Chuyen sang buoc bao gia / xac nhan nhu cau",
];

export const solutionByCustomer = [
  {
    customer: "Cua hang phu tung xe may",
    problems: "Thuong gap tinh trang khach can hang nhanh nhung ma khong ro rang.",
    support: "Ho tro doi chieu nhanh theo ma cu, hinh anh mau va kinh nghiem ung dung.",
    products: "Vong bi, phot chan dau, mo boi tron",
  },
  {
    customer: "Cua hang phu tung o to",
    problems: "Khach hay can doi chieu nhieu ma cho cung mot cum chi tiet.",
    support: "Goi y ma thay the phu hop va uu tien phuong an de chot don nhanh.",
    products: "Vong bi, phot chan dau, day curoa",
  },
  {
    customer: "Gara o to",
    problems: "Xe nam xuong, can xu ly gap de tra xe dung hen.",
    support: "Tu van nhanh theo tinh huong thuc te, uu tien hang de thao lap.",
    products: "Day curoa, phot chan dau, mo boi tron",
  },
  {
    customer: "Xuong co khi",
    problems: "May chay lien tuc, dung may la ton chi phi lon.",
    support: "Dinh huong ma phu hop tai trong va dieu kien van hanh.",
    products: "Vong bi, goi do, xich cong nghiep",
  },
  {
    customer: "Xuong che tao",
    problems: "Can chon vat tu phu hop thong so ngay tu dau de tranh doi lai.",
    support: "Tu van theo thong so truc, tai, moi truong va tan suat su dung.",
    products: "Goi do, xich cong nghiep, day curoa",
  },
  {
    customer: "Nganh may",
    problems: "Can vat tu truyen dong on dinh, it dung may.",
    support: "Ho tro chon day curoa va vong bi phu hop cho may hoat dong lien tuc.",
    products: "Day curoa, vong bi, mo boi tron",
  },
  {
    customer: "Co dien",
    problems: "Can doi chieu ma nhieu he thong voi thong tin phan tan.",
    support: "Tong hop thong tin nhanh va de xuat phuong an thay the de trien khai.",
    products: "Goi do, xich cong nghiep, vong bi",
  },
  {
    customer: "Khach cong nghiep nho",
    problems: "Khong co bo phan vat tu rieng, can nguoi ho tro sat nhu cau.",
    support: "Dong hanh tu khau tiep nhan den buoc bao gia va xac nhan.",
    products: "6 nhom hang co ban theo ung dung",
  },
  {
    customer: "Dai ly vat tu",
    problems: "Can nguon thong tin doi chieu ma on dinh de phuc vu khach le.",
    support: "Ho tro tra ma va de xuat nhom hang theo nhu cau tung khu vuc.",
    products: "Vong bi, goi do, phot chan dau",
  },
];
