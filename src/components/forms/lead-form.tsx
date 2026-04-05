"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { productGroups } from "@/data/site-content";
import { uploadProvider, type UploadedImage } from "@/lib/upload";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const leadSchema = z.object({
  fullName: z.string().min(2, "Vui long nhap ho ten"),
  phone: z.string().min(8, "Vui long nhap so dien thoai"),
  area: z.string().min(2, "Vui long nhap khu vuc"),
  productGroup: z.string().min(1, "Vui long chon nhom san pham"),
  requestedCode: z.string().min(2, "Vui long nhap ma can tim"),
  application: z.string().optional(),
  quantity: z.string().optional(),
  notes: z.string().optional(),
});

type LeadFormValues = z.infer<typeof leadSchema>;

const defaultValues: LeadFormValues = {
  fullName: "",
  phone: "",
  area: "",
  productGroup: "",
  requestedCode: "",
  application: "",
  quantity: "",
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
      `Da tiep nhan yeu cau cua ${values.fullName}. Day la mock local, san sang ket noi API/CRM sau.`,
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
              <Label htmlFor="fullName">Ho ten</Label>
              <Input id="fullName" placeholder="Nguyen Van A" {...register("fullName")} />
              {errors.fullName ? <p className="text-xs text-red-600">{errors.fullName.message}</p> : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">So dien thoai</Label>
              <Input id="phone" placeholder="09xx xxx xxx" {...register("phone")} />
              {errors.phone ? <p className="text-xs text-red-600">{errors.phone.message}</p> : null}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="area">Khu vuc</Label>
              <Input id="area" placeholder="TP.HCM / Binh Duong..." {...register("area")} />
              {errors.area ? <p className="text-xs text-red-600">{errors.area.message}</p> : null}
            </div>
            <div className="space-y-2">
              <Label>Nhom san pham</Label>
              <Select
                value={selectedProductGroup}
                onValueChange={(value) => setValue("productGroup", value, { shouldValidate: true })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chon nhom san pham" />
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="requestedCode">Ma hang can tim</Label>
            <Input id="requestedCode" placeholder="Vi du: 6205-2RS" {...register("requestedCode")} />
            {errors.requestedCode ? <p className="text-xs text-red-600">{errors.requestedCode.message}</p> : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="application">Ung dung / may dang dung</Label>
              <Input id="application" placeholder="May nen khi, may det..." {...register("application")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">So luong</Label>
              <Input id="quantity" placeholder="Vi du: 10 cai" {...register("quantity")} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Ghi chu</Label>
            <Textarea id="notes" placeholder="Thong tin bo sung de doi chieu nhanh hon" rows={4} {...register("notes")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="images">Upload anh</Label>
            <Input id="images" type="file" multiple accept="image/*" onChange={onUploadChange} />
            <p className="text-xs text-slate-500">
              Anh/chi co the gui anh tem, anh mau cu hoac anh vi tri lap de ho tro nhanh hon.
            </p>
            {uploadedImages.length ? (
              <ul className="space-y-1 text-xs text-slate-600">
                {uploadedImages.map((image) => (
                  <li key={image.id}>- {image.name}</li>
                ))}
              </ul>
            ) : null}
          </div>

          <Button type="submit" className="w-full bg-blue-700 hover:bg-blue-800" disabled={isSubmitting}>
            {isSubmitting ? "Dang gui..." : "Gui yeu cau ngay"}
          </Button>

          {submitMessage ? <p className="rounded-md bg-blue-50 p-3 text-sm text-blue-700">{submitMessage}</p> : null}
        </form>
      </CardContent>
    </Card>
  );
}
