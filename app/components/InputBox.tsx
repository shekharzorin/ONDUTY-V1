import styles from "@/app/stylesheet/globalstylesheet";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View
} from "react-native";

type Props = {
  placeholder: string;
  keyboardType?: "default" | "email-address"| "numeric";
  secureTextEntry?: boolean;
  autoComplete?: string;
  autoCapitalizeType?: "none" | "sentences" | "words" | "characters" ;
  autoCorrect?: boolean;
  value: string;
  setValue: (text: string) => void;
  icon?: keyof typeof Ionicons.glyphMap;
} & TextInputProps;

const InputBox = ({
  placeholder,
  keyboardType = "default",
  secureTextEntry = false,
  autoComplete,
  autoCapitalizeType = "none",
  autoCorrect = false,
  value,
  setValue,
  icon,
  ...props
}: Props) => {
  const [secure, setSecure] = useState(secureTextEntry);

  return (
    <View style={[styles.box, styles.h60]}>
      {/* Left Icon (optional) */}
      {icon && (
        <Ionicons name={icon} size={24} color="#646464" style={{marginRight:10}}/>
      )}

      {/* Input Field */}
      <TextInput
        style={[styles.text]}
        placeholder={placeholder}
        placeholderTextColor="#646464"
        keyboardType={keyboardType}
        secureTextEntry={secure}
        autoCapitalize={autoCapitalizeType}
        autoCorrect={autoCorrect}
        autoComplete={autoComplete}
        value={value}
        onChangeText={setValue}
        {...props}
      />

      {/* Password toggle (if secureTextEntry) */}
      {secureTextEntry && (
        <TouchableOpacity onPress={() => setSecure(!secure)}>
          <Ionicons name={secure?"eye-off":"eye"} size={24} color="#646464" style={{marginLeft: 10}}/>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default InputBox;