"use client";

import { useState } from "react";
import { Label } from "../ui/Label";
import { Input } from "../ui/Input";
import { TextArea } from "../ui/TextArea";
import { Button } from "../ui/Button";
import { createContact } from "@/actions/contact";

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string[] } | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    setFieldErrors(null);

    const formData = new FormData(event.currentTarget);
    const result = await createContact(formData);

    if (result.success) {
      setMessage({ type: "success", text: result.message as string });
      (event.target as HTMLFormElement).reset();
    } else {
      if (typeof result.error === "string") {
        setMessage({ type: "error", text: result.error });
      } else {
        setFieldErrors(result.error as { [key: string]: string[] });
        setMessage({ type: "error", text: "Please check your inputs and try again." });
      }
    }

    setLoading(false);
  };

  return (
    <section className="w-full md:w-7/12">
      <div className="glass-form p-8 lg:p-14 rounded-3xl h-full flex flex-col justify-center">
        <form onSubmit={handleSubmit} className="space-y-8">
          {message && (
            <div
              className={`p-4 rounded-lg text-sm ${message.type === "success"
                ? "bg-green-500/10 text-green-500 border border-green-500/20"
                : "bg-red-500/10 text-red-500 border border-red-500/20"
                }`}
            >
              {message.text}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                icon="person"
                placeholder="Enter your name"
                type="text"

              />
              {fieldErrors?.name && (
                <p className="text-red-500 text-xs mt-1">{fieldErrors.name[0]}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                icon="mail"
                placeholder="email@example.com"
                type="email"

              />
              {fieldErrors?.email && (
                <p className="text-red-500 text-xs mt-1">{fieldErrors.email[0]}</p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <TextArea
              id="message"
              name="message"
              icon="chat"
              placeholder="Describe your project vision..."
              rows={8}

            />
            {fieldErrors?.message && (
              <p className="text-red-500 text-xs mt-1">{fieldErrors.message[0]}</p>
            )}
          </div>
          <Button type="submit" icon="arrow_forward" disabled={loading}>
            {loading ? "Sending..." : "Send Message"}
          </Button>
        </form>
      </div>
    </section>
  );
}
