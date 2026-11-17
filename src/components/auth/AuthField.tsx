import { Eye, EyeOff } from "lucide-react-native";
import { useState } from "react";
import { Pressable, Text, TextInput, TextInputProps, View } from "react-native";

type Props = {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  error?: string;
  secure?: boolean;
} & Pick<
  TextInputProps,
  | "placeholder"
  | "keyboardType"
  | "autoComplete"
  | "textContentType"
  | "returnKeyType"
  | "onSubmitEditing"
>;

export function AuthField({
  label,
  value,
  onChangeText,
  error,
  secure = false,
  ...rest
}: Props) {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(secure);

  return (
    <View className="gap-1.5">
      <Text className="text-sm font-black text-carbon">{label}</Text>
      <View
        className={`flex-row items-center rounded-2xl border-2 bg-white px-4 ${
          error ? "border-red-600" : focused ? "border-cobalt" : "border-carbon"
        }`}
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          secureTextEntry={hidden}
          autoCapitalize="none"
          autoCorrect={false}
          placeholderTextColor="#94A3B8"
          className="flex-1 py-3.5 text-base text-carbon"
          {...rest}
        />
        {secure && (
          <Pressable onPress={() => setHidden((h) => !h)} hitSlop={10}>
            {hidden ? (
              <Eye size={20} color="#64748B" />
            ) : (
              <EyeOff size={20} color="#64748B" />
            )}
          </Pressable>
        )}
      </View>
      {error ? (
        <Text className="text-xs font-bold text-red-600">{error}</Text>
      ) : null}
    </View>
  );
}
