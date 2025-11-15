import styles from "@/app/stylesheet/globalstylesheet";
import React from "react";
import {
  ActivityIndicator,
  StyleProp,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from "react-native";

type Props = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean; // 👈 added
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

const Btn = ({ title, onPress, disabled = false, loading = false, style, textStyle }: Props) => {
  return (
    <TouchableOpacity style={[styles.btn,(disabled||loading) && styles.disabledBtn,style]}onPress={onPress}disabled={disabled || loading}>
      {loading ? (
        <ActivityIndicator size="large" color="#8E6BDD" />
      ) : (
        <Text style={[styles.btnText, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

export default Btn;
