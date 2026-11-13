import { Coins, Layers, Package, TrendingUp, Wallet, Building2, CircleDollarSign, ShoppingBag } from "lucide-react";
import { formatNumber, formatTL } from "../../utils/format";
import StatCard from "../../components/ui/StatCard";

export default function FinanceSummary({ totals }) {
  const profitColor =
    totals.profit >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400";

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 xl:grid-cols-5">
      <StatCard icon={Layers} label="Toplam ürün çeşidi" value={formatNumber(totals.kinds)} />
      <StatCard icon={Package} label="Toplam stok adedi" value={formatNumber(totals.units)} />
      <StatCard icon={ShoppingBag} label="Gerçekleşen satış" value={formatTL(totals.salesRevenue)} />
      <StatCard
        icon={TrendingUp}
        label="Satış kârı"
        value={formatTL(totals.salesProfit)}
        valueClass={totals.salesProfit >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}
      />
      <StatCard icon={Wallet} label="Ürün stok maliyeti" value={formatTL(totals.cost)} />
      <StatCard
        icon={Wallet}
        label="Yem gideri"
        value={formatTL(-totals.feedCost)}
        valueClass="text-red-600 dark:text-red-400"
      />
      <StatCard
        icon={Building2}
        label="Şirket gelirleri"
        value={formatTL(totals.companyIncome)}
        valueClass="text-emerald-600 dark:text-emerald-400"
      />
      <StatCard
        icon={CircleDollarSign}
        label="Şirket giderleri"
        value={formatTL(-totals.companyExpense)}
        valueClass="text-red-600 dark:text-red-400"
      />
      <StatCard icon={Coins} label="Potansiyel ciro" value={formatTL(totals.revenue)} />
      <StatCard icon={TrendingUp} label="Tahmini net kar" value={formatTL(totals.profit)} valueClass={profitColor} />
    </div>
  );
}
