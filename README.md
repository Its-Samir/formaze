# Formaze: A Customizable Form Validation package for React

`Formaze` is a flexible and customizable form validation package for react built with `React Hook Form`, `Zod`, and `TailwindCSS`. It provides an easy way to define form validation schemas and handle complex form validation logic efficiently with proper type-safety.

-  Supports multiple field types such as `string`, `email`, `password`, `number`, `date`, and `boolean`.
-  Efficient utilization of zod's built-in validation like `min`, `max`, `regex`, and `optional`.
-  Custom error messages.

## Installation

At First, make sure you have initialized your react project with tailwindcss. (See Guide Below)

You can install the package via npm.

```bash
npm install formaze
```

## Quickstart

```tsx
import { z } from "zod";
import { useFormSchema, createFormValidator } from "formaze";
/* for pre tailwind css styles (check the styling guide below) */
import "formaze/dist/style.css";

// create the validation schema
const formSchema = useFormSchema({
	email: {
		type: "email",
	},
	password: {
		type: "password",
		minLength: {
			value: 8, // by default 6
		},
	},
});

// create the form
const Form = createFormValidator<typeof formSchema>();

export function RegistrationForm() {
	function onSubmit(data: z.infer<typeof formSchema>) {
		const result = formSchema.safeParse(data);

		if (!result.success) throw new Error("Validation error");

		console.log(data);
	}

	return (
		<Form schema={formSchema} onSubmit={onSubmit}>
			<Form.Input type="email" name="email" placeholder="Enter your email" />
			<Form.Input
				type="password"
				name="password"
				placeholder="Enter your password"
			/>
			<button
				className="disabled:cursor-not-allowed border rounded-md bg-blue-400 py-1 px-3 text-white hover:bg-blue-500"
				type="submit"
			>
				Submit
			</button>
		</Form>
	);
}
```

## Define Validation Schema

The useFormSchema hook allows you to define validation rules for each field in the form. You can specify field types (`string`, `email`, `password`, `number`, `date`, `boolean`) along with their specific validation constraints like `minLength`, `maxLength`, `min`, `max`, `regex`, and `optional`.

```js
const formSchema = useFormSchema({
	email: {
		type: "email",
		customMessage: "A valid email is required",
	},
	password: {
		type: "password",
		minLength: {
			value: 8,
			message: "Password must be at least 8 characters",
		},
		maxLength: {
			value: 16,
			message: "Password must be less than 16 characters",
		},
	},
	username: {
		type: "string",
		maxLength: {
			value: 12,
			message: "Username must be less than 12 characters",
		},
		customMessage: "Username must not be empty",
	},
	terms: {
		type: "boolean",
		customMessage: "You must accept the terms to continue",
	},
});
```

### validation option

You can specify the following validation options for each field:

-  **minLength**: Specifies the minimum length for `string` and `password` fields.
-  **maxLength**: Specifies the maximum length for `string` and `password` fields.
-  **min**: Defines the minimum value for `number` and `date` fields.
-  **max**: Defines the maximum value for `number` and `date` fields.
-  **regex**: Allows defining a regular expression pattern for string validation.
-  **optional**: Marks a field as optional.

## For Styling (Make sure you have installed and initialized tailwindcss to your project)

```bash
npm install -D tailwindcss postcss autoprefixer
```

```bash
npx tailwindcss init -p
```

### Configure your template paths

Add the paths to all of your template files in your tailwind.config.js file.

Currently support only for Vite:

```js
/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {},
	},
	plugins: [],
};
```

### Add the Tailwind directives to your CSS

Add the @tailwind directives for each of Tailwind’s layers to your main CSS file.

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### lastly add the css file to the main or App component

```js
import "formze/dist/style.css";
```

## (That's it!)
