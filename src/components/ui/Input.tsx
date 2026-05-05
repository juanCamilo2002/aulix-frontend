import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-content-muted mb-1"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            "w-full px-3 py-2 border rounded-lg text-sm transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent",
            error
              ? "border-danger-300 bg-danger-50"
              : "border-border bg-surface hover:border-content-soft",
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-danger-600">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
