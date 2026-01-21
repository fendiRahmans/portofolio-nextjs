
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type LoginSchema = z.infer<typeof loginSchema>;

export const techStackSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  iconName: z.string().min(1, "Icon name is required"),
  iconColor: z.string().min(1, "Icon color is required"),
  bgColor: z.string().min(1, "Background color is required"),
});

export type TechStackSchema = z.infer<typeof techStackSchema>;
