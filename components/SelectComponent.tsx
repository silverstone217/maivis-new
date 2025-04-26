"use client";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SelectComponentProps {
  options: { label: string; value: string }[];
  placeholder: string;
  defaultValue: string;
  onChange: (value: string) => void;
  isDisabled?: boolean;
  isRequired?: boolean;
}

const SelectComponent = ({
  options,
  placeholder,
  defaultValue,
  onChange,
  isDisabled,
  isRequired,
}: SelectComponentProps) => {
  return (
    <Select
      defaultValue={defaultValue}
      onValueChange={onChange}
      disabled={isDisabled}
      required={isRequired}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default SelectComponent;
