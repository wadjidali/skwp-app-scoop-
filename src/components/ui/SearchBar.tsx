import { Search, X } from "lucide-react-native";
import { Pressable, TextInput, View } from "react-native";

type Props = {
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
};

export function SearchBar({
  value,
  onChangeText,
  placeholder = "Rechercher…",
}: Props) {
  return (
    <View className="mx-5 mb-3 flex-row items-center gap-2 rounded-full border-2 border-carbon bg-white px-4 py-2.5">
      <Search size={18} color="#64748B" strokeWidth={2.5} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#94A3B8"
        returnKeyType="search"
        autoCorrect={false}
        autoCapitalize="none"
        className="flex-1 text-base text-carbon"
      />
      {value.length > 0 && (
        <Pressable onPress={() => onChangeText("")} hitSlop={10}>
          <X size={18} color="#0F172A" strokeWidth={3} />
        </Pressable>
      )}
    </View>
  );
}
