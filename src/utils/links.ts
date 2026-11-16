import { Alert, Linking } from "react-native";

export async function openLink(url: string) {
  try {
    await Linking.openURL(url);
  } catch {
    Alert.alert("Lien impossible à ouvrir", url);
  }
}
