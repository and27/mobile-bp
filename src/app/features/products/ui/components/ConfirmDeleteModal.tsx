import React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import {
  colors,
  radius,
  spacing,
  typography,
} from "../../../../core/theme/tokens";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type ConfirmDeleteModalProps = {
  visible: boolean;
  productName: string;
  onCancel: () => void;
  onConfirm: () => void;
  isDeleting?: boolean;
  errorMessage?: string | null;
};

export default function ConfirmDeleteModal({
  visible,
  productName,
  onCancel,
  onConfirm,
  isDeleting = false,
  errorMessage = null,
}: ConfirmDeleteModalProps) {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onCancel}
    >
      <View
        style={[
          styles.overlay,
          { paddingBottom: Math.max(insets.bottom, spacing.md) },
        ]}
      >
        <View style={styles.card}>
          <View style={styles.header}>
            <Pressable
              onPress={onCancel}
              accessibilityRole="button"
              accessibilityLabel="Close delete confirmation modal"
              style={styles.closeButton}
            >
              <Text style={styles.closeText}>×</Text>
            </Pressable>
          </View>

          <View style={styles.body}>
            <Text style={styles.message}>
              {`Are you sure you want to delete product "${productName}"?`}
            </Text>
            {errorMessage ? (
              <Text style={styles.errorText}>{errorMessage}</Text>
            ) : null}
          </View>

          <View style={styles.actions}>
            <Pressable
              style={[
                styles.confirmButton,
                isDeleting ? styles.disabledButton : null,
              ]}
              onPress={onConfirm}
              disabled={isDeleting}
              accessibilityRole="button"
              accessibilityLabel="Confirm product deletion"
            >
              <Text style={styles.confirmText}>
                {isDeleting ? "Deleting..." : "Confirm"}
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.cancelButton,
                isDeleting ? styles.disabledButton : null,
              ]}
              onPress={onCancel}
              disabled={isDeleting}
              accessibilityRole="button"
              accessibilityLabel="Cancel product deletion"
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(17, 24, 39, 0.45)",
    justifyContent: "flex-end",
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    overflow: "hidden",
  },
  header: {
    minHeight: 44,
    alignItems: "flex-end",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
    paddingHorizontal: spacing.md,
  },
  closeButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  closeText: {
    fontSize: typography.title,
    lineHeight: typography.title,
    color: colors.textSecondary,
  },
  body: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xl,
  },
  message: {
    color: colors.textPrimary,
    textAlign: "center",
    fontSize: typography.body,
    fontWeight: "600",
  },
  errorText: {
    marginTop: spacing.md,
    color: colors.danger,
    textAlign: "center",
    fontSize: typography.caption,
    fontWeight: "600",
  },
  actions: {
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  confirmButton: {
    minHeight: 44,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.actionPrimary,
  },
  cancelButton: {
    minHeight: 44,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.actionSecondary,
  },
  confirmText: {
    color: colors.textPrimary,
    fontSize: typography.body,
    fontWeight: "700",
  },
  cancelText: {
    color: colors.textPrimary,
    fontSize: typography.body,
    fontWeight: "700",
  },
  disabledButton: {
    opacity: 0.6,
  },
});
