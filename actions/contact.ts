"use server"

import { z } from "zod"

const contactSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
})

export async function submitContactForm(prevState: any, formData: FormData) {
  const customData = {
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  }

  const validatedFields = contactSchema.safeParse(customData)

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Please fix the errors below.",
    }
  }

  // Simulate email sending delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Here you would normally send an email using Resend, NodeMailer, etc.
  console.log("Contact Form Submission:", validatedFields.data)

  return {
    success: true,
    message: "Message sent successfully! We'll allow 24-48 hours for a response.",
  }
}
