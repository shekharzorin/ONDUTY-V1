import styles from "@/app/stylesheet/globalstylesheet";
import { FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

type IconLibrary = "MaterialIcons" | "Ionicons" | "FontAwesome5";

type DashCardProps = {
  title: string;
  number: string | number;
  iconName: string;
  iconLibrary?: IconLibrary;
  iconColor?: string;
  iconSize?: number;
};

const ICON_LIBRARIES = { MaterialIcons, Ionicons, FontAwesome5 };

const DashCard: React.FC<DashCardProps> = ({
  title,
  number,
  iconName,
  iconLibrary = "MaterialIcons",
  iconColor = "#888",
  iconSize = 28,
}) => {
  const IconComponent = ICON_LIBRARIES[iconLibrary];

  return (
    <View style={[styles.card]}>
      <Text style={[styles.cardtxt]}>{title}</Text>
      <View style={[styles.rowitem]}>
        <IconComponent name={iconName} size={iconSize} color={iconColor} style={styles.icon} solid/>
        <Text style={[styles.cardnum,styles.rightalign,{right:5}]}>{number}</Text>
      </View>
    </View>
  );
};

export default DashCard;
