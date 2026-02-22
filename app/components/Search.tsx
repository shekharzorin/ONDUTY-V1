import styles from "@/app/stylesheet/globalstylesheet";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { TextInput, View } from "react-native";

type SearchBoxProps = {
  searchText: string;
  setSearchText: (text: string) => void;
  placeholder?: string;
};

const SearchBox: React.FC<SearchBoxProps> = ({ searchText, setSearchText, placeholder }) => {
  return (
      <View style={[styles.searchcard, styles.width100, styles.marginBottom1, styles.h60, {flexDirection:"row"}]}>
        <View style={[styles.centeralign, styles.flex, {flexDirection:'row'}]}>
          <Ionicons name="search" size={30} color="#646464" style={{paddingHorizontal:5}}/>
          <TextInput
            value={searchText}
            onChangeText={setSearchText}
            style={[styles.text, styles.flex, { textAlignVertical: "center" }]}
            placeholder={placeholder || "Search..."}
            placeholderTextColor="#646464"
          />
        </View>
      </View>
  );
};

export default SearchBox;