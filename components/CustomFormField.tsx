"use client";
import React from "react";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";
import Image from "next/image";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { E164Number } from "libphonenumber-js/min";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Select, SelectContent, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";

export enum FormFieldType {
  INPUT = "input",
  TEXTAREA = "textarea",
  PHONE_INPUT = "phoneInput",
  CHECKBOX = "checkbox",
  DATE_PICKER = "datePicker",
  SELECT = "select",
  SKELETON = "skeleton",
}

interface CustomProps {
  control: Control<any>;
  name: string;
  label?: string;
  placeholder?: string;
  iconSrc?: string;
  iconAlt?: string;
  disabled?: boolean;
  dateFormat?: string;
  showTimeSelect?: boolean;
  children?: React.ReactNode;
  renderSkeleton?: (field: any) => React.ReactNode;
  fieldType: FormFieldType; // diambil dari enum FormFieldType
}

// RenderField adalah step 1, membuat sebuah fungsi untuk menampilkan component field berdasarkan fieldType
// fungsi RenderField akan dipanggil dan dijalankan didalam CustomFormField, lalu akan mengembalikan sebuah component(berdasarkan fieldType)
const RenderField = ({ field, props }: { field: any; props: CustomProps }) => {
  const {
    fieldType,
    iconSrc,
    iconAlt,
    placeholder,
    dateFormat,
    showTimeSelect,
    renderSkeleton,
    name,
    label,
  } = props;
  switch (fieldType) {
    case FormFieldType.INPUT: // jika fieldType adalah FormFieldType.INPUT, maka tampilkan component Input text
      return (
        <div className="flex rounded-md border border-dark-500 bg-dark-400">
          {/* icon img */}
          {iconSrc && (
            <Image
              src={iconSrc}
              alt={iconAlt || "icon"}
              width={24}
              height={24}
              className="ml-2"
            />
          )}
          {/* input */}
          <FormControl>
            <Input
              placeholder={placeholder}
              {...field}
              className="shad-input border-0"
            />
            {/* Form menampilkan pesan error */}
          </FormControl>
        </div>
      );

    case FormFieldType.PHONE_INPUT: // jika fieldType adalah FormFieldType.PHONE_INPUT, maka tampilkan component input phone
      return (
        <FormControl>
          <PhoneInput
            defaultCountry="ID"
            placeholder={placeholder}
            international
            withCountryCallingCode
            value={field.value as E164Number | undefined}
            onChange={field.onChange}
            className="input-phone"
          />
        </FormControl>
      );

    case FormFieldType.DATE_PICKER: // jika fieldType adalah FormFieldType.DATE_PICKER, maka tampilkan component input date
      return (
        <div className="flex rounded-md border border-dark-500 bg-dark-400">
          <Image
            src="/assets/icons/calendar.svg"
            width={24}
            height={24}
            alt="calendar"
            className="ml-2"
          />

          <FormControl>
            <DatePicker
              selected={field.value}
              onChange={(date) => field.onChange(date)}
              dateFormat={dateFormat ?? "dd/MM/yyyy"}
              showTimeSelect={showTimeSelect ?? false}
              timeInputLabel="Time:"
              wrapperClassName="date-picker"
            />
          </FormControl>
        </div>
      );

    case FormFieldType.SKELETON: // jika fieldType adalah FormFieldType.SKELETON, maka tampilkan component Skeleton
      return renderSkeleton ? renderSkeleton(field) : null;

    case FormFieldType.SELECT: // jika fieldType adalah FormFieldType.SELECT, maka tampilkan component input select
      return (
        <FormControl>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger className="shad-select-trigger">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="shad-select-content">
              {props.children}
            </SelectContent>
          </Select>
        </FormControl>
      );

    case FormFieldType.TEXTAREA: // jika fieldType adalah FormFieldType.CHECKBOX, maka tampilkan component input checkbox
      return (
        <FormControl>
          <Textarea
            placeholder={placeholder}
            {...field}
            className="shad-textarea"
            disabled={props.disabled}
          />
        </FormControl>
      );

    case FormFieldType.CHECKBOX:
      return (
        <FormControl>
          <div className="flex items-center gap-4">
            <Checkbox
              id={name}
              checked={field.value}
              onCheckedChange={field.onChange}
              className="shad-checkbox"
            />
            <label htmlFor={name} className="checkbox-label">
              {label}
            </label>
          </div>
        </FormControl>
      );
    default:
      break;
  }
};

// CustomFormField adalah step 2, sebuah fungsi yang menerima semua props yg nantinya kan diteruskan ke RenderField
// CustomFormField inilah yg akan di panggil disemua halaman yg membutuhkan form
// sehingga, bisa dikatakan bahwa CustomFormField adalah generator untuk menyusun form
const CustomFormField = (props: CustomProps) => {
  const { control, fieldType, name, label } = props;
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-full">
          {/* Lakukan pengecekan, apakah fieldtype tidak berupa checkbox dan ada label, jika true, maka tampilkan label (jika ada) */}
          {fieldType !== FormFieldType.CHECKBOX && label && (
            <FormLabel>{label}</FormLabel>
          )}
          {/* Panggil render field */}
          <RenderField field={field} props={props} />

          {/* Form menampilkan pesan error */}
          <FormMessage className="shad-error" />
        </FormItem>
      )}
    />
  );
};

export default CustomFormField;
