import { SetStateAction, useCallback, useState } from "react";

// Custom hook to manage form field state and updates
// Usage: const { value, onChange, handleUpdate } = useFormField(initialValue, onFieldUpdate);
// Semantics: - Change: input field changes being captured (e.g., user typing in a text box)
//            - Update: committing to update the parent state/store (e.g., on form submit, blur, etc.)
// This helps to separate transient input state from committed state
// We only need to know how to update the parent when necessary, from that we can manage local state here
// We can also compose this hook for multiple fields in a form to group them together
export default function useFormField<T, E>(fieldValue: T, onFieldUpdate: (val: T) => void, validate?: (val: T) => E | null) {
  const [value, setValue] = useState<T>(fieldValue);
  const [errors, setErrors] = useState<E | null>(null);
  const onChange = useCallback((newValue: SetStateAction<T>) => {
    setValue(newValue);
    setErrors(null);
  }, []);
  const handleUpdate = useCallback(() => {
    if (validate) {
      const validationErrors = validate(value);
      if (validationErrors) {
        setErrors(validationErrors);
        return false;
      }
    }
    onFieldUpdate(value);
    return true;
  }, [onFieldUpdate, value]);
  return { value, errors, onChange, handleUpdate };
}
