declare module "formiz" {
	import { z } from "zod";
	import { type SubmitHandler } from "react-hook-form";

	interface FormProps<T extends ZodSchema>
		extends React.FormHTMLAttributes<HTMLFormElement> {
		schema: T;
		onSubmit: SubmitHandler<z.infer<T>>;
		children: React.ReactNode;
	}

	interface InputProps<T extends ZodSchema>
		extends React.InputHTMLAttributes<HTMLInputElement> {
		name: keyof z.infer<T>;
		label: string;
	}

	interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
		name: string;
		children: React.ReactNode;
	}

	type OptionalAndCustomMessageConfig = {
		optional?: boolean;
		customMessage?: string;
	};

	type StringFieldConfig = {
		type: "string";
		minLength?: { value: number; message?: string };
		maxLength?: { value: number; message?: string };
		regex?: { value: RegExp; message?: string };
	};

	type EmailFieldConfig = {
		type: "email";
		regex?: { value: RegExp; message?: string };
	};

	type PasswordFieldConfig = {
		type: "password";
		minLength?: { value: number; message?: string };
		maxLength?: { value: number; message?: string };
		regex?: { value: RegExp; message?: string };
	};

	type NumberFieldConfig = {
		type: "number";
		min?: { value: number | string | Date; message?: string };
		max?: { value: number | string | Date; message?: string };
	};

	type DateFieldConfig = {
		type: "date";
		min?: { value: string; message?: string };
		max?: { value: string; message?: string };
	};

	type BooleanFieldConfig = {
		type: "boolean";
	};

	type FieldConfig = OptionalAndCustomMessageConfig &
		(
			| StringFieldConfig
			| EmailFieldConfig
			| PasswordFieldConfig
			| NumberFieldConfig
			| DateFieldConfig
			| BooleanFieldConfig
		);

	type SchemaConfig<T extends Record<string, FieldConfig>> = {
		[K in keyof T]: T[K];
	};

	type SchemaKeyValuePair<
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

	declare const createFormValidator: <T extends z.ZodSchema>() => {
		({ schema, onSubmit, children, className }: FormProps<T>): JSX.Element;
		Input({ name, label, className, ...props }: InputProps<T>): JSX.Element;
	};

	declare const useFormSchema: <
		T extends SchemaConfig<Record<string, FieldConfig>>
	>(
		schemaConfig: SchemaConfig<T>
	) => z.ZodObject<SchemaKeyValuePair<T>, "strip", z.ZodTypeAny>;
}
