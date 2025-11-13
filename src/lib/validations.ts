import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name must be less than 50 characters"),
  email: z.string().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  password: z.string().min(8, "Password must be at least 8 characters").max(100, "Password must be less than 100 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const communityPostSchema = z.object({
  content: z.string().min(1, "Content cannot be empty").max(1000, "Content must be less than 1000 characters"),
  image_url: z.string().url("Invalid URL").optional().or(z.literal("")),
});

export const feedPostSchema = z.object({
  title: z.string().min(1, "Title cannot be empty").max(200, "Title must be less than 200 characters"),
  content: z.string().min(1, "Content cannot be empty").max(2000, "Content must be less than 2000 characters"),
  image_url: z.string().url("Invalid URL").optional().or(z.literal("")),
  cta_text: z.string().max(50, "CTA text must be less than 50 characters").optional().or(z.literal("")),
  cta_link: z.string().url("Invalid URL").optional().or(z.literal("")),
});

export const scriptSchema = z.object({
  title: z.string().min(1, "Title cannot be empty").max(200, "Title must be less than 200 characters"),
  category: z.string().min(1, "Category cannot be empty"),
  wrong_way: z.string().min(1, "Wrong way cannot be empty").max(500, "Wrong way must be less than 500 characters"),
  phrase_1: z.string().min(1, "Phrase 1 cannot be empty").max(300, "Phrase must be less than 300 characters"),
  phrase_2: z.string().min(1, "Phrase 2 cannot be empty").max(300, "Phrase must be less than 300 characters"),
  phrase_3: z.string().min(1, "Phrase 3 cannot be empty").max(300, "Phrase must be less than 300 characters"),
  neurological_tip: z.string().min(1, "Neurological tip cannot be empty").max(500, "Neurological tip must be less than 500 characters"),
});

export const commentSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty").max(500, "Comment must be less than 500 characters"),
});
