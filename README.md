# Aronya Akıllı Tarım ve Envanter Yönetim Paneli

Aronya (bal ve arıcılık odaklı) işletmesi için geliştirilmiş; ürün stoğu, finansal kar/zarar analizi, arı yemi ve şirket gelir/gider takibini tek ekranda toplayan bir yönetim paneli. Sunucu veya veritabanı gerektirmez, tüm veriler tarayıcının `localStorage` alanında saklanır ve sayfa yenilense de kaybolmaz.

## Özellikler

### 1. Envanter yönetimi
- Ürün ekleme, düzenleme ve silme (modal form)
- Alanlar: ürün adı, kategori, stok miktarı, birim maliyet (TL), satış fiyatı (TL), gramaj/boyut
- Stok 5'in altına düşünce **"Az kaldı"**, 0 olunca **"Tükendi"** rozeti
- Kategoriye göre filtreleme

### 2. Finans paneli
- Özet kartları: toplam ürün çeşidi, toplam stok adedi, ürün stok maliyeti, yem gideri, şirket gelir/giderleri, potansiyel ciro, tahmini net kar
- Ürün bazlı kar marjı tablosu (renkli çubukla, en yüksek marjdan sıralı)
- Hesaplama kuralları:
  - Ürün stok maliyeti = Σ (ürün stoğu × ürün birim maliyeti)
  - Yem maliyeti = Σ (yem stoğu (kg) × yem birim maliyeti (TL/kg)); finans ekranında eksi gösterilir
  - Potansiyel ciro = Σ (stok × satış fiyatı)
  - Satış kârı = Σ (satış adedi × (satış anındaki birim fiyat − maliyet))
  - Tahmini net kar = Potansiyel ciro − Ürün stok maliyeti + Satış kârı − Yem maliyeti + Şirket gelirleri − Şirket giderleri
  - Kar marjı (%) = (Satış − Maliyet) ÷ Satış × 100

### 3. Yem ve besleme takibi
- Yem adı, stok (kg), birim maliyet (TL/kg), günlük tüketim tahmini, kritik seviye ve son eklenme tarihi
- Yem stoklarının toplam maliyeti finans panelinde gider olarak eksi gösterilir ve net kârdan düşülür
- Stok kritik seviyenin altına inince kart kırmızıya döner ve uyarı rozeti çıkar
- "Tahmini yetecek süre" (stok ÷ günlük tüketim) otomatik hesaplanır
- Tek tıkla stok ekleme (son eklenme tarihi otomatik güncellenir)
- Kullanılan miktar stoktan düşülür; kullanım tarihçesi saklanır
- Son 12 aylık kullanım grafiği ve günlük, haftalık, aylık ortalama kullanım özeti

### 4. Şirket
- Şirketin diğer gelir ve gider kalemlerini (ör. işçilik ödemesi, kira geliri) tarih ve tutar bilgisiyle kaydetme, düzenleme ve silme
- Toplam gelir, toplam gider ve şirket neti özeti
- Şirket gelirleri finans panelinde artı, giderleri eksi olarak gösterilir ve tahmini net kâra dahil edilir

### 5. Arama
- Üstteki arama çubuğu tüm sekmelerde anlık çalışır
- Ürünlerde isme ve kategoriye, yemlerde ve şirket kalemlerinde isme göre filtreler
- Türkçe karakterlere duyarlıdır (İ/ı, Ş/ş vb.)

### 6. Satış, yedekleme ve raporlama
- Envanterde ürünün satış adedi ve birim fiyatı kaydedilir; satış anındaki maliyet saklanır ve ürün stoğu otomatik azaltılır
- Finans ekranında satış geçmişi, gerçekleşen ciro ve satış kârı gösterilir
- Son 12 ayın satış cirosu ve satış kârı grafikleri
- Tüm ürün, yem, şirket ve satış verileri için JSON yedekleme ve yedeği içe aktarma
- Ürün, yem, şirket ve satış kayıtlarını CSV olarak dışa aktarma

### Genel
- Koyu/açık tema: cihazın tema ayarını otomatik izler
- Mobil uyumlu (tablolar yatay kaydırılır)
- Veriler `localStorage` ile kalıcıdır

## Teknolojiler

| Teknoloji | Kullanım |
|---|---|
| React | Arayüz |
| Vite | Geliştirme ortamı ve derleme |
| Tailwind CSS | Stil |
| Lucide React | İkonlar |

## Kurulum

```bash
# 1. Vite + React projesi oluştur
npm create vite@latest aronya-panel -- --template react
cd aronya-panel

# 2. Bağımlılıkları kur
npm install
npm install lucide-react
npm install -D tailwindcss @tailwindcss/vite
```

**`vite.config.js`** dosyasını şu şekilde düzenle:

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

**`src/index.css`** dosyasının içeriğini şununla değiştir:

```css
@import "tailwindcss";
```

Ardından `src/` klasörünü bu projedeki `src/` ile değiştir ve çalıştır:

```bash
npm run dev
```

Üretim derlemesi için:

```bash
npm run build
npm run preview
```

## Proje yapısı

```
src/
├── App.jsx                    → sekmeleri ve verileri birleştirir
├── constants.js               → sabitler (stok eşiği, storage anahtarları)
├── data/
│   └── seedData.js            → ilk açılış örnek verileri
├── utils/
│   ├── calculations.js        → kar, marj, ciro, yem süresi hesapları
│   ├── validation.js          → form doğrulama
│   ├── format.js              → TL, sayı ve tarih biçimlendirme
│   └── helpers.js             → id üretme, arama eşleşmesi vb.
├── hooks/
│   ├── useLocalStorage.js     → localStorage ile kalıcı state
│   ├── useCollection.js       → ekle / güncelle / sil mantığı
│   └── useForm.js             → form state yönetimi
├── components/
│   ├── ui/                    → Modal, Badge, Field, StatCard, EmptyState, styles
│   └── layout/                → Header, TabNav
└── features/
    ├── inventory/             → InventoryTab, ProductTable, ProductForm
    ├── finance/               → FinanceTab, FinanceSummary, MarginTable
    ├── feed/                  → FeedTab, FeedCard, FeedForm
    └── company/               → şirket gelir/gider kayıtları
```

### Mimari ilkeler
- **İş mantığı arayüzden ayrıdır.** `calculations.js` ve `validation.js` saf fonksiyonlardır; bileşenlerden bağımsız okunur ve test edilir.
- **CRUD tek yerde.** `useCollection` hem ürünler hem yemler için aynı ekle/güncelle/sil mantığını sağlar.
- **Feature klasörleri.** Her modül (envanter, finans, yem) kendi ekranını, tablosunu ve formunu kendi klasöründe tutar.
- **Tekrar yok.** Ortak Tailwind sınıfları `components/ui/styles.js` içinde toplanır.

## Veri saklama

Veriler tarayıcıda şu anahtarlarla tutulur:

| Anahtar | İçerik |
|---|---|
| `aronya.products` | Ürün listesi |
| `aronya.feeds` | Yem listesi |
| `aronya.feedUsages` | Yem kullanım miktarları ve tarihçesi |
| `aronya.company` | Şirket gelir ve gider kalemleri |
| `aronya.sales` | Satış geçmişi ve satış anındaki birim maliyet/fiyat |
| `aronya.tab` | Son açık olan sekme |

> **Önemli:** Veriler yalnızca kullanılan tarayıcıda ve cihazda saklanır. Tarayıcı verilerini (site verileri/çerezler) temizlemek kayıtları siler. Farklı cihazlar arasında otomatik senkronizasyon yoktur.

İlk açılışta `data/seedData.js` içindeki örnek veriler yüklenir. Sıfırdan başlamak için örnek kayıtları panelden silebilir veya tarayıcı konsolunda şunu çalıştırabilirsin:

```js
localStorage.clear(); location.reload();
```

## Özelleştirme

| Ne değiştirmek istiyorsun? | Nerede? |
|---|---|
| Ürün "az kaldı" stok eşiği | `constants.js` → `LOW_STOCK_THRESHOLD` |
| Düşük marj uyarı eşiği (%) | `features/finance/MarginTable.jsx` → `LOW_MARGIN` |
| Yem varsayılan kritik seviyesi | `features/feed/FeedForm.jsx` → `emptyFeed` |
| Örnek veriler | `data/seedData.js` |
| Renkler ve ortak stiller | `components/ui/styles.js` |
