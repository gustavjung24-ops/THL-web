"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { leadFormBottomNote, leadFormUploadHint, productGroups } from "@/data/site-content";
import { uploadProvider, type UploadedImage } from "@/lib/upload";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const leadSchema = z.object({
  fullName: z.string().min(2, "Vui lòng nhập họ tên người liên hệ"),
  phone: z.string().min(8, "Vui lòng nhập số điện thoại"),
  company: z.string().min(2, "Vui lòng nhập nhà máy / công ty"),
  area: z.string().min(2, "Vui lòng nhập khu vực / KCN"),
  productGroup: z.string().min(1, "Vui lòng chọn nhóm vật tư cần hỗ trợ"),
  requestedCode: z.string().min(2, "Vui lòng nhập mã đang dùng"),
  application: z.string().optional(),
  quantity: z.string().optional(),
  priority: z.string().min(1, "Vui lòng chọn mức độ ưu tiên"),
  notes: z.string().optional(),
});

type LeadFormValues = z.infer<typeof leadSchema>;

const defaultValues: LeadFormValues = {
  fullName: "",
  phone: "",
  company: "",
  area: "",
  productGroup: "",
  requestedCode: "",
  application: "",
  quantity: "",
  priority: "",
  notes: "",
};

export function LeadForm() {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [submitMessage, setSubmitMessage] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues,
  });

  const selectedProductGroup = watch("productGroup");
  const selectedPriority = watch("priority");

  async function onUploadChange(event: React.ChangeEvent<HTMLInputElement>) {
    const fileList = event.target.files;
    if (!fileList?.length) return;
    const files = Array.from(fileList);
    const uploaded = await uploadProvider.upload(files);
    setUploadedImages((prev) => [...prev, ...uploaded]);
  }

  async function onSubmit(values: LeadFormValues) {
    await new Promise((resolve) => setTimeout(resolve, 700));
    setSubmitMessage(
      `Đã tiếp nhận yêu cầu hỗ trợ của ${values.fullName}. Bộ phận tư vấn sẽ phản hồi sớm theo mức độ ưu tiên đã chọn.`,
    );
    reset(defaultValues);
    setUploadedImages([]);
  }

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardContent className="space-y-6 p-5 sm:p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fullName">Họ tên người liên hệ</Label>
              <Input id="fullName" placeholder="Nguyễn Văn A" {...register("fullName")} />
              {errors.fullName ? <p className="text-xs text-red-600">{errors.fullName.message}</p> : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input id="phone" placeholder="09xx xxx xxx" {...register("phone")} />
              {errors.phone ? <p className="text-xs text-red-600">{errors.phone.message}</p> : null}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="company">Nhà máy / công ty</Label>
              <Input id="company" placeholder="Công ty ABC" {...register("company")} />
              {errors.company ? <p className="text-xs text-red-600">{errors.company.message}</p> : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="area">Khu vực / KCN</Label>
              <Input id="area" placeholder="KCN Sóng Thần / Bình Dương" {...register("area")} />
              {errors.area ? <p className="text-xs text-red-600">{errors.area.message}</p> : null}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Nhóm vật tư cần hỗ trợ</Label>
              <Select
                value={selectedProductGroup}
                onValueChange={(value) =>
                  setValue("productGroup", value ?? "", { shouldValidate: true, shouldDirty: true })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn nhóm vật tư" />
                </SelectTrigger>
                <SelectContent>
                  {productGroups.map((group) => (
                    <SelectItem key={group.slug} value={group.name}>
                      {group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.productGroup ? <p className="text-xs text-red-600">{errors.productGroup.message}</p> : null}
            </div>

            <div className="space-y-2">
              <Label>Mức độ ưu tiên</Label>
              <Select
                value={selectedPriority}
                onValueChange={(value) => setValue("priority", value ?? "", { shouldValidate: true, shouldDirty: true })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn mức độ ưu tiên" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Khẩn trong ngày">Khẩn trong ngày</SelectItem>
                  <SelectItem value="Ưu tiên trong ca">Ưu tiên trong ca</SelectItem>
                  <SelectItem value="Bình thường theo kế hoạch">Bình thường theo kế hoạch</SelectItem>
                </SelectContent>
              </Select>
              {errors.priority ? <p className="text-xs text-red-600">{errors.priority.message}</p> : null}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="requestedCode">Mã đang dùng</Label>
            <Input id="requestedCode" placeholder="Ví dụ: 6205-2RS" {...register("requestedCode")} />
            {errors.requestedCode ? <p className="text-xs text-red-600">{errors.requestedCode.message}</p> : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="application">Thiết bị / cụm máy đang lắp</Label>
              <Input id="application" placeholder="Motor quạt lò sấy / trục băng tải..." {...register("application")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Số lượng dự kiến</Label>
              <Input id="quantity" placeholder="Ví dụ: 10 bộ" {...register("quantity")} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Ghi chú thêm</Label>
            <Textarea id="notes" placeholder="Thông tin bổ sung để đối chiếu nhanh hơn" rows={4} {...register("notes")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="images">Tải ảnh tem / ảnh mẫu / ảnh vị trí lắp</Label>
            <Input id="images" type="file" multiple accept="image/*" onChange={onUploadChange} />
            <p className="text-xs text-slate-500">{leadFormUploadHint}</p>
            {uploadedImages.length ? (
              <ul className="space-y-1 text-xs text-slate-600">
                {uploadedImages.map((image) => (
                  <li key={image.id}>- {image.name}</li>
                ))}
              </ul>
            ) : null}
          </div>

          <Button type="submit" className="w-full bg-amber-800 hover:bg-amber-900" disabled={isSubmitting}>
            {isSubmitting ? "Đang gửi..." : "Gửi yêu cầu hỗ trợ"}
          </Button>

          <p className="text-xs text-slate-600">{leadFormBottomNote}</p>

          {submitMessage ? <p className="rounded-md bg-amber-50 p-3 text-sm text-amber-800">{submitMessage}</p> : null}
        </form>
      </CardContent>
    </Card>
  );
}
