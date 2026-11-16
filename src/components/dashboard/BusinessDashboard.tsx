import { useRouter } from "expo-router";
import {
    Bookmark,
    Eye,
    Lock,
    MousePointerClick,
    UserCheck,
} from "lucide-react-native";
import { useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useAppStore } from "../../store/useAppStore";
import { gemStats, weekLabels, weeklyTrend } from "../../utils/stats";
import { PaywallModal } from "../premium/PaywallModal";
import { GemStatRow } from "./GemStatRow";
import { KpiCard } from "./KpiCard";
import { TrendChart } from "./TrendChart";

export function BusinessDashboard() {
  const router = useRouter();
  const myGems = useAppStore((s) => s.myGems);
  const plan = useAppStore((s) => s.plan);
  const [showPaywall, setShowPaywall] = useState(false);

  const rows = useMemo(
    () => myGems.map((g) => ({ gem: g, stats: gemStats(g) })),
    [myGems],
  );
  const totals = useMemo(
    () =>
      rows.reduce(
        (t, r) => ({
          views: t.views + r.stats.views,
          clicks: t.clicks + r.stats.clicks,
          conversions: t.conversions + r.stats.conversions,
          saves: t.saves + r.stats.saves,
        }),
        { views: 0, clicks: 0, conversions: 0, saves: 0 },
      ),
    [rows],
  );
  const trend = useMemo(() => weeklyTrend(myGems), [myGems]);
  const labels = useMemo(() => weekLabels(), []);

  const locked = plan === "free";
  const hasTrend = plan === "business";
  const rate =
    totals.views > 0
      ? Math.round((totals.conversions / totals.views) * 1000) / 10
      : 0;

  return (
    <View className="gap-4">
      <View className="rounded-2xl border-2 border-dashed border-slate-300 px-3 py-2">
        <Text className="text-[11px] text-slate-500">
          Données de démonstration : les statistiques réelles arriveront avec le
          serveur.
        </Text>
      </View>

      {locked ? (
        <>
          <View className="flex-row flex-wrap justify-between opacity-60">
            <KpiCard
              label="Vues"
              value="—"
              bg="#E2E8F0"
              icon={<Eye size={16} color="#0F172A" />}
            />
            <KpiCard
              label="Clics"
              value="—"
              bg="#E2E8F0"
              icon={<MousePointerClick size={16} color="#0F172A" />}
            />
            <KpiCard
              label="Conversions"
              value="—"
              bg="#E2E8F0"
              icon={<UserCheck size={16} color="#0F172A" />}
            />
            <KpiCard
              label="Sauvegardes"
              value="—"
              bg="#E2E8F0"
              icon={<Bookmark size={16} color="#0F172A" />}
            />
          </View>

          <View className="items-center rounded-3xl border-2 border-carbon bg-white p-6">
            <View className="h-14 w-14 items-center justify-center rounded-full border-2 border-carbon bg-lime">
              <Lock size={24} color="#0F172A" strokeWidth={3} />
            </View>
            <Text
              className="mt-3 text-center font-black text-carbon"
              style={{ fontSize: 22, letterSpacing: -0.5 }}
            >
              Tableau de bord Pro
            </Text>
            <Text className="mt-1 text-center text-sm text-slate-600">
              Tu as publié {myGems.length} pépite{myGems.length > 1 ? "s" : ""}.
              Passe à l'offre Pro pour suivre leurs vues, leurs clics et leurs
              inscriptions.
            </Text>
            <Pressable
              onPress={() => setShowPaywall(true)}
              className="mt-4 rounded-full bg-cobalt px-6 py-3.5 active:opacity-80"
            >
              <Text className="font-black text-white">Voir les offres</Text>
            </Pressable>
          </View>
        </>
      ) : rows.length === 0 ? (
        <View className="items-center rounded-3xl border-2 border-dashed border-slate-300 p-8">
          <Text className="text-center font-black text-carbon">
            Aucune publication pour l'instant.
          </Text>
          <Text className="mt-1 text-center text-slate-500">
            Publie ta première pépite pour voir ses statistiques ici.
          </Text>
          <Pressable
            onPress={() => router.navigate("/gems")}
            className="mt-4 rounded-full bg-carbon px-6 py-3 active:opacity-80"
          >
            <Text className="font-bold text-white">Aller aux Pépites</Text>
          </Pressable>
        </View>
      ) : (
        <>
          <View className="flex-row flex-wrap justify-between">
            <KpiCard
              label="Vues"
              value={totals.views}
              bg="#FFFFFF"
              icon={<Eye size={16} color="#0F172A" strokeWidth={2.5} />}
            />
            <KpiCard
              label="Clics"
              value={totals.clicks}
              bg="#FDE68A"
              icon={
                <MousePointerClick
                  size={16}
                  color="#0F172A"
                  strokeWidth={2.5}
                />
              }
            />
            <KpiCard
              label="Conversions"
              value={totals.conversions}
              bg="#BEF264"
              icon={<UserCheck size={16} color="#0F172A" strokeWidth={2.5} />}
            />
            <KpiCard
              label="Sauvegardes"
              value={totals.saves}
              bg="#FFFFFF"
              icon={<Bookmark size={16} color="#0F172A" strokeWidth={2.5} />}
            />
          </View>

          <View className="rounded-2xl border-2 border-carbon bg-cobalt px-4 py-3">
            <Text className="text-sm font-black text-white">
              Taux de conversion : {rate.toLocaleString("fr-FR")} %
            </Text>
          </View>

          {hasTrend ? (
            <TrendChart data={trend} labels={labels} />
          ) : (
            <View className="rounded-3xl border-2 border-dashed border-carbon bg-white p-4">
              <View className="flex-row items-center gap-2">
                <Lock size={16} color="#0F172A" strokeWidth={3} />
                <Text className="text-base font-black text-carbon">
                  Évolution sur 7 jours
                </Text>
              </View>
              <Text className="mt-1 text-sm text-slate-600">
                Le graphique des vues jour par jour est inclus dans l'offre
                Business.
              </Text>
              <Pressable
                onPress={() => setShowPaywall(true)}
                className="mt-3 self-start rounded-full border-2 border-carbon px-4 py-2 active:opacity-80"
              >
                <Text className="text-sm font-black text-carbon">
                  Passer à Business
                </Text>
              </Pressable>
            </View>
          )}

          <Text className="text-lg font-black text-carbon">
            Tes publications
          </Text>
          <View>
            {rows.map((r) => (
              <GemStatRow key={r.gem.id} gem={r.gem} stats={r.stats} />
            ))}
          </View>
        </>
      )}

      <PaywallModal
        visible={showPaywall}
        onClose={() => setShowPaywall(false)}
        reason="browse"
      />
    </View>
  );
}
