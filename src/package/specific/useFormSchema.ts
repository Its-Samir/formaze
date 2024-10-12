import { z } from "zod";
import { refactorFieldName } from "../_utils";
import { FieldConfig, SchemaConfig, SchemaKeyValuePair } from "types/index";

export const useFormSchema = <
	T extends SchemaConfig<Record<string, FieldConfig>>
>(
	schemaConfig: SchemaConfig<T>
) => {
	const schemaFields: SchemaKeyValuePair<T> = {} as any;

	for (const [fieldName, config] of Object.entries(schemaConfig as T)) {
		let fieldSchema;

		switch (config.type) {
			case "string":
				if (config.optional) {
					fieldSchema = z.optional(z.string());
				} else {
					fieldSchema = z.string().min(1, {
						message: config.customMessage || "This field is required",
					});

					if (config.minLength)
						fieldSchema = fieldSchema.min(
							config.minLength.value,
							config.minLength.message ||
								`${refactorFieldName(fieldName)} must be at least ${
									config.minLength.value
								} character long`
						);

					if (config.maxLength)
						fieldSchema = fieldSchema.max(
							config.maxLength.value,
							config.maxLength.message ||
								`${refactorFieldName(fieldName)} must be at most ${
									config.maxLength.value
								} character`
						);

					if (config.regex)
						fieldSchema = fieldSchema.regex(
							config.regex.value,
							config.regex.message
						);
				}

				break;

			case "email":
				if (config.optional) {
					fieldSchema = z.optional(
						z.string().email(config.customMessage || "Invalid email")
					);
				} else {
					fieldSchema = z
						.string()
						.email(config.customMessage || "Invalid email");
				}
				break;

			case "password":
				if (config.optional) {
					fieldSchema = z.optional(z.string());
				} else {
					fieldSchema = z
						.string()
						.min(
							6,
							config.customMessage ||
								`${refactorFieldName(fieldName)} must be at least ${
									config.minLength ? config.minLength.value : 6
								} character long`
						);

					if (config.minLength)
						fieldSchema = fieldSchema.min(
							config.minLength.value,
							config.minLength.message ||
								`${refactorFieldName(fieldName)} must be at least ${
									config.minLength.value
								} character long`
						);

					if (config.maxLength)
						fieldSchema = fieldSchema.max(
							config.maxLength.value,
							config.maxLength.message ||
								`${refactorFieldName(fieldName)} must be at most ${
									config.maxLength.value
								} character`
						);

					if (config.regex)
						fieldSchema = fieldSchema.regex(
							config.regex.value,
							config.regex.message
						);
				}
				break;

			case "number":
				if (config.optional) {
					fieldSchema = z.optional(
						z.preprocess((a) => Number(a), z.number())
					);
				} else {
					fieldSchema = z
						.preprocess((a) => Number(a), z.number())
						.refine(
							(val) => Number(val),
							`${config.customMessage || "This field is required"}`
						);

					if (config.min)
						fieldSchema = fieldSchema.refine(
							(val) =>
								config.min && typeof config.min.value === "number"
									? val >= config.min.value
									: val,
							{
								message:
									config.min.message ||
									`${refactorFieldName(
										fieldName
									)} must be greater than or equal to ${
										config.min.value
									}`,
							}
						);

					if (config.max)
						fieldSchema = fieldSchema.refine(
							(val) =>
								config.max && typeof config.max.value === "number"
									? val <= config.max.value
									: val,
							{
								message:
									config.max.message ||
									`${refactorFieldName(
										fieldName
									)} must be less than or equal to ${
										config.max.value
									}`,
							}
						);
				}
				break;

			case "date":
				if (config.optional) {
					fieldSchema = z.preprocess(
						(a) => new Date(a as string),
						z.date()
					);
				} else {
					fieldSchema = z
						.preprocess((a) => new Date(a as string), z.date())
						.refine(
							(val) => new Date(val.toString()),
							config.customMessage || "Invalid date format"
						);

					if (config.min) {
						fieldSchema = fieldSchema.refine(
							(val) =>
								new Date(val.toString()) > new Date(config.min?.value!),
							config.min.message ||
								`${refactorFieldName(
									fieldName
								)} must be greater than ${new Date(
									config.min?.value!
								).toLocaleDateString("en-IN", { dateStyle: "medium" })}`
						);
					}

					if (config.max) {
						fieldSchema = fieldSchema.refine(
							(val) =>
								new Date(val.toString()) < new Date(config.max?.value!),
							config.max.message ||
								`${refactorFieldName(
									fieldName
								)} must be less than ${new Date(
									config.max?.value!
								).toLocaleDateString("en-IN", { dateStyle: "medium" })}`
						);
					}
				}
				break;

			case "boolean":
				if (config.optional) {
					fieldSchema = z.preprocess(
						(val) => (val === "true" || val === true ? true : false),
						z.boolean()
					);
				} else {
					fieldSchema = z
						.preprocess(
							(val) => (val === "true" || val === true ? true : false),
							z.boolean()
						)
						.refine((val) => Boolean(val), {
							message: config.customMessage || "Invalid value",
						});
				}
				break;

			default:
				throw new Error(`Unsupported field type`);
		}

		schemaFields[fieldName as keyof T] = fieldSchema as any;
	}

	return z.object(schemaFields);
};
