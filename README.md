# Formaze: A Customizable Form Validation package for React

Formaze is a flexible and customizable form validation package for react built with `React Hook Form`, `Zod`, and `TailwindCSS`. It provides an easy way to define form validation schemas and handle complex form validation logic efficiently with proper type-safety.

-  Supports multiple field types such as `string`, `email`, `password`, `number`, `date`, and `boolean`.
-  Efficient utilization of zod's built-in validation like `min`, `max`, `regex`, and `optional`.
-  Custom error messages.

## Installation

You can install the package via npm.

```bash
npm install formaze
```

## Quickstart

```tsx
// if you are using next.js (app router) then activate the below line "use client" directive otherwise remove it

// "use client" 
import { z } from "zod";
import { useFormSchema, createFormValidator } from "formaze";
/* for pre-styled css (check the styling guide below) */
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
	function handleSubmit(data: z.infer<typeof formSchema>) {
		const result = formSchema.safeParse(data);

		if (!result.success) throw new Error("Invalid inputs");

		console.log(data);
	}

	return (
		<Form schema={formSchema} onSubmit={handleSubmit}>
			<Form.Input
			 	type="email" 
				name="email" 
				placeholder="Enter your email"
			/>
			<Form.Input
				type="password"
				name="password"
				placeholder="Enter your password"
			/>
			<button
				className="rounded-md bg-blue-500 py-1 px-3 text-white hover:bg-blue-600"
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

Though, you can directly use `zod` to define schema as well and pass it to the Form props created through `createFormValidator` method.

```tsx
import { z } from "zod";

const formSchema = z.object({
	email: z.string().email(),
	name: z.string().min(3, {message: "Required"})
});
```

### Validation options

You can specify the following validation options for each field:

-  **minLength**: Specifies the minimum length for `string` and `password` fields.
-  **maxLength**: Specifies the maximum length for `string` and `password` fields.
-  **min**: Defines the minimum value for `number` and `date` fields.
-  **max**: Defines the maximum value for `number` and `date` fields.
-  **regex**: Allows defining a regular expression pattern for string validation.
-  **optional**: Marks a field as optional.

## Styling

- For Tailwind (pre-styled)

Follow the [Official Tailwind Docs](https://tailwindcss.com/docs/installation/framework-guides) for initializing project with vite or next.js

You can add your own styles or import the below css (styled with tailwind css) file into the main or App component or the component where the form is being used

```js
import "formaze/dist/style.css";
```

- For Pure CSS
Here are the css classes with default styles, add it into main css file
```css
.form-control {
   display: flex;
   flex-direction: column;
   justify-content: center;
   gap: 1rem;
}

.form-control .form-field {
   display: flex;
   flex-direction: column;
   justify-content: center;
}

.form-control .form-field .form-input {
   padding: 10px 1rem;
   border-radius: 10px;
   border-width: 1px;
   border-color: rgb(209 213 219);
}

.form-control .form-field .form-input:focus {
   border-color: rgb(59 130 246);
   outline: none;
}

.form-control .form-field-error-text { 
   color: rgb(220, 38, 38);
	font-size: 0.875rem;
}

/* or */

.form-control .form-field-error { 
   color: rgb(220, 38, 38);
}
```

## For Next.js (app router)

You just have to add `"use client"` directive at the top of your file where you are using this form and its related methods

```tsx
"use client"
// your code
```

## (That's it!)
