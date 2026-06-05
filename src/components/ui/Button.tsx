import Link from "next/link";
import { type ButtonHTMLAttributes, type ReactNode } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: string;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "md" | "lg";
  children: ReactNode;
};

const variants = {
  primary: "bg-emerald-800 text-white hover:bg-emerald-900",
  secondary: "border-2 border-emerald-800 text-emerald-800 hover:bg-emerald-50",
  danger: "bg-red-600 text-white hover:bg-red-700",
  ghost: "text-gray-700 hover:bg-gray-100",
};

const sizes = {
  md: "px-4 py-2.5 text-base min-h-[48px]",
  lg: "px-6 py-3.5 text-lg min-h-[56px]",
};

export function Button({
  href,
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: Props) {
  const cls = `inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition ${variants[variant]} ${sizes[size]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }

  return (
    <button className={cls} {...props}>
      {children}
    </button>
  );
}
