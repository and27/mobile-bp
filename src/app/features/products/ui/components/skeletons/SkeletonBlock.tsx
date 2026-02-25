import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { colors, radius } from "../../../../../core/theme/tokens";

type SkeletonBlockProps = {
  width?: number | `${number}%`;
  height: number;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
};

export default function SkeletonBlock({
  width = "100%",
  height,
  borderRadius = radius.sm,
  style,
}: SkeletonBlockProps) {
  return (
    <View
      style={[
        styles.block,
        {
          width,
          height,
          borderRadius,
        },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  block: {
    backgroundColor: colors.surfacePressed,
  },
});
