"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const contactSchema = z.object({
  fullName: z.string().min(2, "Vui lòng nhập họ tên"),
  phone: z.string().min(8, "Vui lòng nhập số điện thoại"),
  message: z.string().min(5, "Vui lòng nhập nội dung"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export function ContactForm() {
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      message: "",
    },
  });

  async function onSubmit() {
    await new Promise((resolve) => setTimeout(resolve, 500));
    setDone(true);
    reset();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="space-y-2">
        <Label htmlFor="contactName">Họ tên</Label>
        <Input id="contactName" placeholder="Nguyễn Văn A" {...register("fullName")} />
        {errors.fullName ? <p className="text-xs text-red-600">{errors.fullName.message}</p> : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="contactPhone">Số điện thoại</Label>
        <Input id="contactPhone" placeholder="09xx xxx xxx" {...register("phone")} />
        {errors.phone ? <p className="text-xs text-red-600">{errors.phone.message}</p> : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="contactMessage">Nội dung cần THL hỗ trợ</Label>
        <Textarea id="contactMessage" rows={4} placeholder="Mã hàng, nhóm vật tư, ứng dụng hoặc tiến độ cần xử lý" {...register("message")} />
        {errors.message ? <p className="text-xs text-red-600">{errors.message.message}</p> : null}
      </div>
      <Button type="submit" className="w-full bg-blue-800 hover:bg-blue-900" disabled={isSubmitting}>
        {isSubmitting ? "Đang gửi..." : "Gửi liên hệ"}
      </Button>
      {done ? <p className="text-sm text-blue-800">Đã tiếp nhận thông tin. Đội THL B2B sẽ phản hồi sớm.</p> : null}
    </form>
  );
}
