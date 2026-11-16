import { Check, X } from "lucide-react-native";
import { Alert, Modal, Pressable, ScrollView, Text, View } from "react-native";
import { Plan, PLAN_NAME, PLANS, quotaLabel } from "../../constants/plans";
import { useAppStore } from "../../store/useAppStore";

type Props = {
  visible: boolean;
  onClose: () => void;
  reason?: "quota" | "browse";
};

export function PaywallModal({ visible, onClose, reason = "browse" }: Props) {
  const plan = useAppStore((s) => s.plan);
  const used = useAppStore((s) => s.myGems.length);
  const setPlan = useAppStore((s) => s.setPlan);

  const subscribe = (p: Plan) => {
    Alert.alert(
      `Offre ${p.name} · ${p.price} ${p.period}`,
      "Le paiement n'est pas encore branché : l'offre sera activée en mode test sur cet appareil.",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Activer (test)",
          onPress: () => {
            setPlan(p.id);
            onClose();
          },
        },
      ],
    );
  };

  const backToFree = () => {
    setPlan("free");
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-paper">
        <View className="flex-row items-start justify-between px-5 pb-2 pt-5">
          <View className="flex-1 pr-4">
            <Text
              className="font-black text-carbon"
              style={{ fontSize: 32, lineHeight: 34, letterSpacing: -1.5 }}
            >
              {reason === "quota" ? "LIMITE ATTEINTE." : "OFFRES PRO."}
            </Text>
            <Text className="mt-2 text-sm leading-5 text-slate-600">
              {reason === "quota"
                ? "Tu as utilisé tes publications gratuites. Choisis une offre pour continuer à publier."
                : "Publie davantage et suis bientôt les performances de tes annonces."}
            </Text>
          </View>
          <Pressable
            onPress={onClose}
            hitSlop={12}
            className="h-10 w-10 items-center justify-center rounded-full border-2 border-carbon bg-white"
          >
            <X size={20} color="#0F172A" strokeWidth={3} />
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={{ padding: 20, paddingBottom: 40, gap: 16 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="self-start rounded-full border-2 border-carbon bg-white px-3 py-1.5">
            <Text className="text-xs font-black text-carbon">
              {PLAN_NAME[plan] === "Gratuite"
                ? "Offre actuelle : "
                : "Offre actuelle : "}
              {quotaLabel(plan, used)}
            </Text>
          </View>

          {PLANS.map((p) => {
            const current = plan === p.id;
            return (
              <View
                key={p.id}
                style={{ backgroundColor: p.popular ? "#BEF264" : "#FFFFFF" }}
                className="rounded-3xl border-2 border-carbon p-5"
              >
                <View className="flex-row items-center justify-between">
                  <Text
                    className="font-black text-carbon"
                    style={{ fontSize: 26, letterSpacing: -1 }}
                  >
                    {p.name}
                  </Text>
                  {p.popular && (
                    <View className="rounded-full bg-carbon px-3 py-1">
                      <Text className="text-[11px] font-black uppercase text-white">
                        Populaire
                      </Text>
                    </View>
                  )}
                </View>

                <View className="mt-1 flex-row items-end gap-1">
                  <Text
                    className="font-black text-carbon"
                    style={{ fontSize: 32, letterSpacing: -1 }}
                  >
                    {p.price}
                  </Text>
                  <Text className="mb-1.5 text-sm font-bold text-slate-600">
                    {p.period}
                  </Text>
                </View>

                <View className="mt-3 gap-2">
                  {p.features.map((f) => (
                    <View key={f.label} className="flex-row items-start gap-2">
                      <Check size={18} color="#0F172A" strokeWidth={3} />
                      <Text className="flex-1 text-[15px] leading-5 text-carbon">
                        {f.label}
                      </Text>
                      {f.soon && (
                        <View className="rounded-full border border-carbon px-2 py-0.5">
                          <Text className="text-[10px] font-black text-carbon">
                            bientôt
                          </Text>
                        </View>
                      )}
                    </View>
                  ))}
                </View>

                <Pressable
                  disabled={current}
                  onPress={() => subscribe(p)}
                  className={`mt-4 items-center rounded-full py-3.5 ${
                    current ? "bg-slate-300" : "bg-cobalt active:opacity-80"
                  }`}
                >
                  <Text
                    className={`text-base font-black ${
                      current ? "text-slate-600" : "text-white"
                    }`}
                  >
                    {current ? "Offre actuelle" : `Choisir ${p.name}`}
                  </Text>
                </Pressable>
              </View>
            );
          })}

          {plan !== "free" && (
            <Pressable onPress={backToFree} className="items-center py-2">
              <Text className="text-xs font-bold text-slate-500 underline">
                Revenir à l'offre gratuite (test)
              </Text>
            </Pressable>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}
