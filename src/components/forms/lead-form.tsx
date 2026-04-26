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
  fullName: z.string().min(2, "Vui lÃ²ng nháº­p há» tÃªn ngÆ°á»i liÃªn há»‡"),
  phone: z.string().min(8, "Vui lÃ²ng nháº­p sá»‘ Ä‘iá»‡n thoáº¡i"),
  company: z.string().min(2, "Vui lÃ²ng nháº­p nhÃ  mÃ¡y / cÃ´ng ty"),
  area: z.string().min(2, "Vui lÃ²ng nháº­p khu vá»±c / KCN"),
  productGroup: z.string().min(1, "Vui lÃ²ng chá»n nhÃ³m váº­t tÆ° cáº§n há»— trá»£"),
  requestedCode: z.string().min(2, "Vui lÃ²ng nháº­p mÃ£ Ä‘ang dÃ¹ng"),
  application: z.string().optional(),
  quantity: z.string().optional(),
  priority: z.string().min(1, "Vui lÃ²ng chá»n má»©c Ä‘á»™ Æ°u tiÃªn"),
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
      `ÄÃ£ tiáº¿p nháº­n yÃªu cáº§u há»— trá»£ cá»§a ${values.fullName}. Bá»™ pháº­n tÆ° váº¥n sáº½ pháº£n há»“i sá»›m theo má»©c Ä‘á»™ Æ°u tiÃªn Ä‘Ã£ chá»n.`,
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
              <Label htmlFor="fullName">Há» tÃªn ngÆ°á»i liÃªn há»‡</Label>
              <Input id="fullName" placeholder="Nguyá»…n VÄƒn A" {...register("fullName")} />
              {errors.fullName ? <p className="text-xs text-red-600">{errors.fullName.message}</p> : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Sá»‘ Ä‘iá»‡n thoáº¡i</Label>
              <Input id="phone" placeholder="09xx xxx xxx" {...register("phone")} />
              {errors.phone ? <p className="text-xs text-red-600">{errors.phone.message}</p> : null}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="company">NhÃ  mÃ¡y / cÃ´ng ty</Label>
              <Input id="company" placeholder="CÃ´ng ty ABC" {...register("company")} />
              {errors.company ? <p className="text-xs text-red-600">{errors.company.message}</p> : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="area">Khu vá»±c / KCN</Label>
              <Input id="area" placeholder="KCN SÃ³ng Tháº§n / BÃ¬nh DÆ°Æ¡ng" {...register("area")} />
              {errors.area ? <p className="text-xs text-red-600">{errors.area.message}</p> : null}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>NhÃ³m váº­t tÆ° cáº§n há»— trá»£</Label>
              <Select
                value={selectedProductGroup}
                onValueChange={(value) =>
                  setValue("productGroup", value ?? "", { shouldValidate: true, shouldDirty: true })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chá»n nhÃ³m váº­t tÆ°" />
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
              <Label>Má»©c Ä‘á»™ Æ°u tiÃªn</Label>
              <Select
                value={selectedPriority}
                onValueChange={(value) => setValue("priority", value ?? "", { shouldValidate: true, shouldDirty: true })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chá»n má»©c Ä‘á»™ Æ°u tiÃªn" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Kháº©n trong ngÃ y">Kháº©n trong ngÃ y</SelectItem>
                  <SelectItem value="Æ¯u tiÃªn trong ca">Æ¯u tiÃªn trong ca</SelectItem>
                  <SelectItem value="BÃ¬nh thÆ°á»ng theo káº¿ hoáº¡ch">BÃ¬nh thÆ°á»ng theo káº¿ hoáº¡ch</SelectItem>
                </SelectContent>
              </Select>
              {errors.priority ? <p className="text-xs text-red-600">{errors.priority.message}</p> : null}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="requestedCode">MÃ£ Ä‘ang dÃ¹ng</Label>
            <Input id="requestedCode" placeholder="VÃ­ dá»¥: 6205-2RS" {...register("requestedCode")} />
            {errors.requestedCode ? <p className="text-xs text-red-600">{errors.requestedCode.message}</p> : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="application">Thiáº¿t bá»‹ / cá»¥m mÃ¡y Ä‘ang láº¯p</Label>
              <Input id="application" placeholder="Motor quáº¡t lÃ² sáº¥y / trá»¥c bÄƒng táº£i..." {...register("application")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Sá»‘ lÆ°á»£ng dá»± kiáº¿n</Label>
              <Input id="quantity" placeholder="VÃ­ dá»¥: 10 bá»™" {...register("quantity")} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Ghi chÃº thÃªm</Label>
            <Textarea id="notes" placeholder="ThÃ´ng tin bá»• sung Ä‘á»ƒ Ä‘á»‘i chiáº¿u nhanh hÆ¡n" rows={4} {...register("notes")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="images">Táº£i áº£nh tem / áº£nh máº«u / áº£nh vá»‹ trÃ­ láº¯p</Label>
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

          <Button type="submit" className="w-full bg-blue-800 hover:bg-blue-900" disabled={isSubmitting}>
            {isSubmitting ? "Äang gá»­i..." : "Gá»­i yÃªu cáº§u há»— trá»£"}
          </Button>

          <p className="text-xs text-slate-600">{leadFormBottomNote}</p>

          {submitMessage ? <p className="rounded-md bg-blue-50 p-3 text-sm text-blue-800">{submitMessage}</p> : null}
        </form>
      </CardContent>
    </Card>
  );
}

