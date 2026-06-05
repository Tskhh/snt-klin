import { type InputHTMLAttributes } from "react";

export function Input({
  label,
  error,
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
}) {
  return (
    <label className="block">
      {label && (
        <span className="mb-1.5 block text-base font-medium text-gray-800">
          {label}
        </span>
      )}
      <input
        className={`w-full rounded-xl border border-gray-300 px-4 py-3 text-lg outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200 ${className}`}
        {...props}
      />
      {error && <span className="mt-1 block text-sm text-red-600">{error}</span>}
    </label>
  );
}
