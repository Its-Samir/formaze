import { z } from "zod";
import { DefaultValues, SubmitHandler } from "react-hook-form";

interface FormProps<T extends z.ZodSchema>
	extends React.FormHTMLAttributes<HTMLFormElement> {
	schema: T;
	onSubmit: SubmitHandler<z.infer<T>>;
	defaultValues?: DefaultValues<z.infer<T>>;
	children: React.ReactNode;
}

interface InputProps<T extends z.ZodSchema>
	extends React.InputHTMLAttributes<HTMLInputElement> {
	name: keyof z.infer<T>;
	label?: string;
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

type SchemaKeyValuePair<T extends SchemaConfig<Record<string, FieldConfig>>> = {
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

/**
 * Generates a Form component with built-in validation using Zod and React Hook Form.
 * The returned Form component also includes an Input component for form fields with automatic schema-based validation.
 *
 * @template T - The Zod schema used to define the structure and validation rules for the form.
 *
 * @returns {{
 *   ({schema, children, className, onSubmit, ...props}: FormProps<T>): JSX.Element;
 *   Input: ({label, name, className, ...props}: InputProps<T>) => JSX.Element;
 * }} - The generated Form component that supports schema-based form handling and an Input component for each form field.
 *
 * @component Form
 * @param {T} schema - Zod schema defining the form fields and validation rules.
 * @param {SubmitHandler<z.infer<T>>} onSubmit - Function to handle form submission after successful validation.
 * @param {DefaultValues<z.infer<T>>} [defaultValues] - Optional default values to pre-populate the form fields.
 * @param {React.ReactNode} children - Form fields and other JSX components, including Form.Input components.
 * @param {string} [className] - Optional class for the form element.
 *
 * @component Input
 * @param {keyof z.infer<T>} name - The name of the form field, matching the key of the schema.
 * @param {string} label - Label for the form input.
 * @param {string} [className] - Optional class for the input element.
 *
 * @example
 * // Create a form schema
 * const schema = useFormSchema({
 *   email: { type: "email" },
 *   password: { type: "string", minLength: { value: 8 } },
 * });
 *
 * // Generate the Form component
 * const MyForm = createFormValidator<typeof schema>();
 *
 * <MyForm schema={schema} onSubmit={(data) => {}}>
 *   <MyForm.Input name="email" label="Email" type="email" />
 *   <MyForm.Input name="password" label="Password" type="password" />
 *   <button type="submit">Submit</button>
 * </MyForm>;
 */

declare const createFormValidator: <T extends z.ZodSchema>() => {
	({ schema, onSubmit, children, className }: FormProps<T>): JSX.Element;
	Input({ name, label, className, ...props }: InputProps<T>): JSX.Element;
};

/**
 * Generates a Zod schema based on the provided configuration.
 * This utility function is useful for creating dynamic form schemas with validation rules.
 *
 * @template T - The shape of the schema config, where T extends a record of field configurations.
 *
 * @param {SchemaConfig<T>} schemaConfig - An object that defines the fields and validation rules for the form.
 * Each key in the object represents a form field, and its value specifies the field's type, optional status, and any additional validation logic.
 *
 * @returns {z.ZodObject<T>} - Returns a Zod schema that can be used for form validation.
 *
 * @example
 * const schema = useFormSchema({
 *   email: { type: "email" },
 *   password: {
 *     type: "string",
 *     minLength: { value: 8 },
 *   },
 * });
 */

declare const useFormSchema: <
	T extends SchemaConfig<Record<string, FieldConfig>>
>(
	schemaConfig: SchemaConfig<T>
) => z.ZodObject<
	SchemaKeyValuePair<T>,
	"strip",
	z.ZodTypeAny,
	{
		[k in keyof z.objectUtil.addQuestionMarks<
			z.baseObjectOutputType<SchemaKeyValuePair<T>>,
			any
		>]: z.objectUtil.addQuestionMarks<
			z.baseObjectOutputType<SchemaKeyValuePair<T>>,
			any
		>[k];
	},
	{
		[k_1 in keyof z.baseObjectInputType<
			SchemaKeyValuePair<T>
		>]: z.baseObjectInputType<SchemaKeyValuePair<T>>[k_1];
	}
>;
