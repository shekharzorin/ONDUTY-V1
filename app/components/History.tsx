import styles from "@/app/stylesheet/globalstylesheet";
import React from "react";
import { Image, ImageSourcePropType, Text, TouchableOpacity, View } from "react-native";

type Props = {
  title?: string;
  onPress: () => void;
  backIcon?: ImageSourcePropType;
};

const History = ({ title = "History", onPress, backIcon }: Props) => {
  return (
    <View style={styles.marginBottom1}>
      <View style={[styles.rowitem, { paddingTop: 10 }]}>
        {/* Left Back Button */}
        <TouchableOpacity onPress={onPress} style={styles.leftalign}>
          <Image source={require("@/assets/images/backbutton.png")} style={styles.bellicon} />
        </TouchableOpacity>

        {/* Center Title */}
        <View style={styles.centerContainer}>
          <Text style={styles.header}>{title}</Text>
        </View>
      </View>
    </View>
  );
};

export default History;
