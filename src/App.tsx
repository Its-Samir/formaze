import { createFormValidator } from "./package/specific/index";
import { useFormSchema } from "./package/specific/index";

const registrationSchema = useFormSchema({
	email: {
		type: "email",
		customMessage: "A valid email is required",
	},
	password: {
		type: "string",
		minLength: { value: 8 },
		customMessage: "Password must be at least 8 character(s) long",
	},
	age: {
		type: "number",
		optional: true,
	},
	dob: {
		type: "date",
		min: { value: "09-30-2024" },
		customMessage: "Enter a valid date of birth",
	},
	terms: {
		type: "boolean",
		customMessage: "You must accept the terms and conditions",
	},
});

const Form = createFormValidator(registrationSchema);

function App() {
	return (
		<>
			<Form
				onSubmit={(data) => {
					const result = registrationSchema.safeParse(data);

					if (!result.success) {
						throw new Error(result.error.toString());
					}

					console.log(result.data);
				}}
				schema={registrationSchema}
			>
				<Form.Input label="Email" name="email" type="email" />
				<Form.Input label="Password" name="password" type="password" />
				<Form.Input label="Age" name="age" type="number" />
				<Form.Input label="Date of Birth" name="dob" type="date" />
				<Form.Input label="Accept Terms" name="terms" type="checkbox" />
				<button
					className="rounded-md bg-blue-400 py-1 px-3 text-white hover:bg-blue-500"
					type="submit"
				>
					Submit
				</button>
			</Form>
		</>
	);
}

export default App;
