import {
  Text,
  TextInput,
  TextInputProps,
  View,
  StyleSheet,
} from "react-native";
import {
  colors,
  radius,
  spacing,
  typography,
} from "../../../../core/theme/tokens";

type ProductFormFieldProps = {
  label: string;
  value: string;
  onChangeText?: (value: string) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
} & Omit<TextInputProps, "value" | "onChangeText" | "placeholder">;

export default function ProductFormField({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  disabled = false,
  required = false,
  ...rest
}: ProductFormFieldProps) {
  const accessibilityState = {
    disabled,
    ...(required ? { required: true } : {}),
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
        {required ? <Text style={styles.requiredMark}> *</Text> : null}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        accessibilityLabel={`${label}${required ? " (required)" : ""}`}
        accessibilityState={accessibilityState}
        editable={!disabled}
        style={[
          styles.input,
          disabled ? styles.inputDisabled : null,
          error ? styles.inputError : null,
        ]}
        {...rest}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  label: {
    color: colors.textPrimary,
    fontSize: typography.caption,
    fontWeight: "600",
  },
  requiredMark: {
    color: colors.danger,
  },
  input: {
    borderColor: colors.borderSubtle,
    borderWidth: 1,
    borderRadius: radius.sm,
    padding: spacing.md,
    backgroundColor: colors.surface,
    color: colors.textPrimary,
    fontSize: typography.body,
  },
  inputDisabled: {
    backgroundColor: colors.surfacePressed,
    color: colors.textSecondary,
  },
  inputError: {
    borderColor: colors.danger,
  },
  errorText: {
    color: colors.danger,
    fontSize: typography.caption,
  },
});
