import { useState } from "react";

/**
 * Form durumunu yönetir.
 * Kullanım: <input {...field("name")} />
 */
export function useForm(initialValues) {
  const [values, setValues] = useState(initialValues);

  const field = (name) => ({
    value: values[name],
    onChange: (event) => setValues((prev) => ({ ...prev, [name]: event.target.value })),
  });

  return { values, field };
}
