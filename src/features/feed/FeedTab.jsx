import { useMemo, useState } from "react";
import { AlertTriangle, Plus } from "lucide-react";
import { isFeedCritical } from "../../utils/calculations";
import { matchesQuery, parseDecimal, todayISO, toFormValues } from "../../utils/helpers";
import Badge from "../../components/ui/Badge";
import EmptyState from "../../components/ui/EmptyState";
import Modal from "../../components/ui/Modal";
import { buttonPrimary } from "../../components/ui/styles";
import FeedCard from "./FeedCard";
import FeedForm from "./FeedForm";
import FeedUsageForm from "./FeedUsageForm";
import FeedUsageReport from "./FeedUsageReport";

const NEW_FEED = "new";

export default function FeedTab({ feeds, feedUsages, query }) {
  const [editing, setEditing] = useState(null); // null | NEW_FEED | yem nesnesi
  const [usingFeed, setUsingFeed] = useState(null);

  const visibleFeeds = useMemo(
    () => feeds.items.filter((feed) => matchesQuery(query, feed.name)),
    [feeds.items, query]
  );
  const criticalCount = feeds.items.filter(isFeedCritical).length;

  const handleSave = (data) => {
    if (editing === NEW_FEED) feeds.add(data);
    else feeds.update(editing.id, data);
    setEditing(null);
  };

  const handleDelete = (feed) => {
    if (window.confirm(`"${feed.name}" silinsin mi?`)) feeds.remove(feed.id);
  };

  const handleAddStock = (feed) => {
    const amount = parseDecimal(window.prompt(`"${feed.name}" için eklenecek miktar (kg):`));
    if (amount > 0) feeds.update(feed.id, { stock: feed.stock + amount, lastAdded: todayISO() });
  };

  const handleUseFeed = (usageData) => {
    const feed = feeds.items.find((item) => item.id === usingFeed.id);
    if (!feed || usageData.quantity > feed.stock) {
      return "Kullanım miktarı mevcut stoktan fazla olamaz.";
    }

    feeds.update(feed.id, { stock: feed.stock - usageData.quantity });
    feedUsages.add({
      ...usageData,
      feedId: feed.id,
      feedName: feed.name,
    });
    setUsingFeed(null);
    return "";
  };

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {criticalCount > 0 ? (
          <Badge tone="red"><AlertTriangle size={12} /> {criticalCount} yem kritik seviyede</Badge>
        ) : (
          <Badge tone="green">Tüm yem stokları yeterli</Badge>
        )}
        <button className={buttonPrimary} onClick={() => setEditing(NEW_FEED)}>
          <Plus size={16} /> Yem ekle
        </button>
      </div>

      {visibleFeeds.length === 0 ? (
        <EmptyState text={feeds.items.length ? "Aramanla eşleşen yem yok." : "Henüz yem kaydı yok."} />
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {visibleFeeds.map((feed) => (
            <FeedCard
              key={feed.id}
              feed={feed}
              onAddStock={handleAddStock}
              onUse={setUsingFeed}
              onEdit={setEditing}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <FeedUsageReport usages={feedUsages.items} />

      {editing && (
        <Modal title={editing === NEW_FEED ? "Yeni yem kaydı" : "Yemi düzenle"} onClose={() => setEditing(null)}>
          <FeedForm
            initialValues={editing === NEW_FEED ? undefined : toFormValues({ ...editing, cost: editing.cost ?? 0 })}
            onSubmit={handleSave}
            onCancel={() => setEditing(null)}
          />
        </Modal>
      )}
      {usingFeed && (
        <Modal title={`Yem kullanımı: ${usingFeed.name}`} onClose={() => setUsingFeed(null)}>
          <FeedUsageForm
            feed={usingFeed}
            onSubmit={handleUseFeed}
            onCancel={() => setUsingFeed(null)}
          />
        </Modal>
      )}
    </section>
  );
}
