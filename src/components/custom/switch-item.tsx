import React from "react";

import { cn } from "~lib/utils";

import { Switch } from "../ui/switch";

interface SwitchProps extends React.ComponentProps<typeof Switch> {
  icon: React.ReactNode;
  label: string;
}

export default function SwitchItem({
  icon,
  label,
  className,
  ...props
}: SwitchProps) {
  return (
    <label
      htmlFor={props.id}
      className="flex items-center justify-between py-2 cursor-pointer">
      <div className="flex items-center space-x-2">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      <Switch
        className={cn(
          "data-[state=checked]:bg-[#344854] data-[state=checked]:border-[#344854]",
          className
        )}
        {...props}
      />
    </label>
  );
}
