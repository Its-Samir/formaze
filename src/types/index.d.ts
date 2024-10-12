import { z } from "zod";
import { SubmitHandler } from "react-hook-form";

export interface FormProps<T extends z.ZodSchema>
	extends React.FormHTMLAttributes<HTMLFormElement> {
	schema: T;
	onSubmit: SubmitHandler<z.infer<T>>;
	children: React.ReactNode;
}

export interface InputProps<T extends z.ZodSchema>
	extends React.InputHTMLAttributes<HTMLInputElement> {
	name: keyof z.infer<T>;
	label: string;
}

export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
	name: string;
	children: React.ReactNode;
}

export type OptionalAndCustomMessageConfig = {
	optional?: boolean;
	customMessage?: string;
};

export type StringFieldConfig = {
	type: "string";
	minLength?: { value: number; message?: string };
	maxLength?: { value: number; message?: string };
	regex?: { value: RegExp; message?: string };
};

export type EmailFieldConfig = {
	type: "email";
	regex?: { value: RegExp; message?: string };
};

export type PasswordFieldConfig = {
	type: "password";
	minLength?: { value: number; message?: string };
	maxLength?: { value: number; message?: string };
	regex?: { value: RegExp; message?: string };
};

export type NumberFieldConfig = {
	type: "number";
	min?: { value: number | string | Date; message?: string };
	max?: { value: number | string | Date; message?: string };
};

export type DateFieldConfig = {
	type: "date";
	min?: { value: string; message?: string };
	max?: { value: string; message?: string };
};

export type BooleanFieldConfig = {
	type: "boolean";
};

export type FieldConfig = OptionalAndCustomMessageConfig &
	(
		| StringFieldConfig
		| EmailFieldConfig
		| PasswordFieldConfig
		| NumberFieldConfig
		| DateFieldConfig
		| BooleanFieldConfig
	);

export type SchemaConfig<T extends Record<string, FieldConfig>> = {
	[K in keyof T]: T[K];
};

export type SchemaKeyValuePair<
	T extends SchemaConfig<Record<string, FieldConfig>>
> = {
	[K in keyof T]: T[K]["optional"] extends true
		? z.ZodOptional<
				T[K]["type"] extends "email" | "password" | "string"
					? z.ZodString
					: T[K]["type"] extends "number"
					? z.ZodNumber
					: T[K]["type"] extends "boolean"
					? z.ZodBoolean
					: T[K]["type"] extends "date"
					? z.ZodDate
					: z.ZodTypeAny
		  >
		: T[K]["type"] extends "string" | "email" | "password"
		? z.ZodString
		: T[K]["type"] extends "number"
		? z.ZodNumber
		: T[K]["type"] extends "boolean"
		? z.ZodBoolean
		: T[K]["type"] extends "date"
		? z.ZodDate
		: z.ZodTypeAny;
};
