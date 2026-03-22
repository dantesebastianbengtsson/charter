"use client";

import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

export function Button({ variant = "primary", size = "md", className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "font-semibold rounded-xl transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer",
        variant === "primary" && "bg-violet-600 text-white hover:bg-violet-500 shadow-lg shadow-violet-600/25",
        variant === "secondary" && "bg-white/10 text-white hover:bg-white/20 border border-white/20",
        variant === "ghost" && "text-white/70 hover:text-white hover:bg-white/10",
        variant === "danger" && "bg-red-600 text-white hover:bg-red-500",
        size === "sm" && "px-3 py-1.5 text-sm",
        size === "md" && "px-5 py-2.5 text-base",
        size === "lg" && "px-8 py-4 text-lg",
        className
      )}
      {...props}
    />
  );
}
