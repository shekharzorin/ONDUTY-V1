import styles from '@/app/stylesheet/globalstylesheet';
import React from 'react';
import { KeyboardTypeOptions, Text, TextInput, TextInputProps, View } from 'react-native';

type Props = {
  title: string;
  placeholder: string;
  value: string;
  setValue: (text: string) => void;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  keyboardType?: KeyboardTypeOptions; // ✅ added for dynamic keyboard type
} & TextInputProps;

const ProfileCard = ({
  title,
  placeholder,
  value,
  setValue,
  autoCapitalize = 'none',
  keyboardType = 'default', // ✅ default keyboard type
  ...props
}: Props) => {
  return (
    <View style={[styles.profilecard, {height:90}]}>
      <Text style={styles.label}>{title}</Text>
      <TextInput
        style={styles.profiletext}
        placeholder={placeholder}
        placeholderTextColor="#000"
        value={value}
        onChangeText={setValue}
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType} // ✅ dynamic keyboard type
        {...props}
      />
    </View>
  );
};

export default ProfileCard;
