import { useCallback, useState } from "react";

// Custom hook to manage form field state and updates
// Usage: const { value, onChange, handleUpdate } = useFormField(initialValue, onFieldUpdate);
// Semantics: - Change: input field changes being captured (e.g., user typing in a text box)
//            - Update: committing to update the parent state/store (e.g., on form submit, blur, etc.)
// This helps to separate transient input state from committed state
// We only need to know how to update the parent when necessary, from that we can manage local state here
// We can also compose this hook for multiple fields in a form to group them together
export default function useFormField<T>(fieldValue: T, onFieldUpdate: (val: T) => void) {
  const [value, onChange] = useState<T>(fieldValue);
  const handleUpdate = useCallback(() => onFieldUpdate(value), [onFieldUpdate, value]);
  return { value, onChange, handleUpdate };
}
