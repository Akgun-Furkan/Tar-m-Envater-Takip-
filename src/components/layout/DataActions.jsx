import { useRef } from "react";
import { Download, FileSpreadsheet, Upload } from "lucide-react";
import { buttonGhost } from "../ui/styles";
import { createBackup, createCsv, transferFileName, validateBackup } from "../../utils/dataTransfer";

function downloadFile(contents, type, filename) {
  const url = URL.createObjectURL(new Blob([contents], { type }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

export default function DataActions({ collections }) {
  const fileInput = useRef(null);

  const exportJson = () => {
    const data = Object.fromEntries(
      Object.entries(collections).map(([key, collection]) => [key, collection.items])
    );
    downloadFile(
      JSON.stringify(createBackup(data), null, 2),
      "application/json",
      transferFileName("json")
    );
  };

  const exportCsv = () => {
    const data = Object.fromEntries(
      Object.entries(collections).map(([key, collection]) => [key, collection.items])
    );
    downloadFile(`\uFEFF${createCsv(data)}`, "text/csv;charset=utf-8", transferFileName("csv"));
  };

  const importJson = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const backup = JSON.parse(await file.text());
      if (!validateBackup(backup)) {
        window.alert("Yedek dosyası geçersiz veya desteklenmeyen bir sürümde.");
        return;
      }
      if (!window.confirm("Bu işlem mevcut ürün, yem, yem kullanım, şirket ve satış verilerinin üzerine yazacak. Devam edilsin mi?")) {
        return;
      }
      Object.entries(collections).forEach(([key, collection]) => {
        collection.replace(backup.data[key] ?? []);
      });
      window.alert("Yedek başarıyla içe aktarıldı.");
    } catch (error) {
      window.alert(`Yedek dosyası okunamadı: ${error.message}`);
    } finally {
      event.target.value = "";
    }
  };

  return (
    <div className="flex flex-wrap justify-end gap-2 px-4 pb-2">
      <button className={`${buttonGhost} !px-3 !py-1.5 !text-xs`} onClick={exportJson}>
        <Download size={14} /> JSON yedekle
      </button>
      <button className={`${buttonGhost} !px-3 !py-1.5 !text-xs`} onClick={() => fileInput.current?.click()}>
        <Upload size={14} /> JSON içe aktar
      </button>
      <button className={`${buttonGhost} !px-3 !py-1.5 !text-xs`} onClick={exportCsv}>
        <FileSpreadsheet size={14} /> CSV dışa aktar
      </button>
      <input ref={fileInput} type="file" accept=".json,application/json" className="hidden" onChange={importJson} />
    </div>
  );
}
