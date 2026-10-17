import { z } from "zod";

export const orderSchema = z.object({
  dishId: z.string().min(1, "Dish selection is required"),
  quantity: z.coerce.number().int().min(1, "Quantity must be at least 1"),
  customerName: z
    .string({ required_error: "Full name is required" })
    .trim()
    .min(2, "Full name must be at least 2 characters")
    .max(80, "Name cannot exceed 80 characters"),
  address: z
    .string({ required_error: "Delivery address is required" })
    .trim()
    .min(5, "Delivery address must be at least 5 characters (subcity, street, building or house #)")
    .max(200, "Address cannot exceed 200 characters"),
  phone: z
    .string({ required_error: "Phone number is required" })
    .trim()
    .min(9, "Phone number is required (at least 9 digits)")
    .regex(
      /^(\+?251|0)?[79]\d{8}$|^[\d\s+\-()]{9,18}$/,
      "Please enter a valid phone number (e.g. 0911234567, 0712345678, or +251 91 123 4567)"
    ),
  paymentMethod: z
    .enum(["Cash on Delivery", "Telebirr", "CBE Birr"], {
      errorMap: () => ({ message: "Please select a valid payment method (Cash on Delivery, Telebirr, or CBE Birr)" }),
    })
    .default("Cash on Delivery"),
  items: z.string().optional(),
  total: z.coerce.number().positive("Total must be greater than 0").optional(),
  notes: z
    .string()
    .trim()
    .max(300, "Notes cannot exceed 300 characters")
    .optional()
    .or(z.literal("")),
});
