import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  // 基底クラス - Neo-Brutalism スタイル
  [
    "inline-flex",
    "items-center",
    "justify-center",
    "font-semibold",
    "border-2",
    "border-black",
    "transition-all",
    "duration-150",
    "ease-out",
    "focus:outline-none",
    "focus:ring-2",
    "focus:ring-offset-2",
    "focus:ring-accent",
    "disabled:pointer-events-none",
    "disabled:opacity-50",
  ],
  {
    variants: {
      variant: {
        default: [
          "bg-white",
          "text-black",
          "hover:bg-black",
          "hover:text-white",
          "shadow-[2px_2px_0_0_#0A0A0A]",
          "hover:shadow-[0_0_0_0_#0A0A0A]",
          "hover:translate-x-0.5",
          "hover:translate-y-0.5",
          "active:shadow-none",
          "active:translate-x-[2px]",
          "active:translate-y-[2px]",
        ],
        primary: [
          "bg-accent",
          "text-white",
          "hover:bg-accent-dark",
          "hover:text-white",
          "shadow-[2px_2px_0_0_#0A0A0A]",
          "hover:shadow-[0_0_0_0_#0A0A0A]",
          "hover:translate-x-0.5",
          "hover:translate-y-0.5",
          "active:shadow-none",
          "active:translate-x-[2px]",
          "active:translate-y-[2px]",
        ],
        secondary: [
          "bg-gray-100",
          "text-black",
          "hover:bg-gray-200",
          "hover:text-black",
          "shadow-[2px_2px_0_0_#0A0A0A]",
          "hover:shadow-[0_0_0_0_#0A0A0A]",
          "hover:translate-x-0.5",
          "hover:translate-y-0.5",
          "active:shadow-none",
          "active:translate-x-[2px]",
          "active:translate-y-[2px]",
        ],
        outline: [
          "bg-transparent",
          "text-black",
          "hover:bg-black",
          "hover:text-white",
          "shadow-none",
        ],
        ghost: [
          "bg-transparent",
          "text-black",
          "hover:bg-gray-100",
          "hover:text-black",
          "border-transparent",
          "shadow-none",
        ],
      },
      size: {
        sm: ["h-9", "px-3", "text-sm"],
        default: ["h-11", "px-5", "text-base"],
        lg: ["h-14", "px-7", "text-lg"],
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={buttonVariants({ variant, size, className })}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
