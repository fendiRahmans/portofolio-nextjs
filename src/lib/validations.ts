
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

export const careerSchema = z.object({
  year: z.string().min(1, "Year is required"),
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().min(1, "Subtitle is required"),
  description: z.string().min(1, "Description is required"),
  icon: z.string().min(1, "Icon is required"),
  color: z.enum([
    "primary",
    "cyan",
    "purple",
    "amber",
    "emerald",
    "rose",
    "indigo",
  ]),
  techStack: z.array(z.string()).optional(),
  keyProjects: z.array(z.string()).optional(),
});

export type CareerSchema = z.infer<typeof careerSchema>;
