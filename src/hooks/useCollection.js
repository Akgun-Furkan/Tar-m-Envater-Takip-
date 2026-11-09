import { useLocalStorage } from "./useLocalStorage";
import { createId } from "../utils/helpers";

/** localStorage'da kalıcı bir liste + ekle / güncelle / sil işlemleri. */
export function useCollection(storageKey, seed = []) {
  const [items, setItems] = useLocalStorage(storageKey, seed);

  const add = (data) => setItems((list) => [...list, { ...data, id: createId() }]);

  const update = (id, patch) =>
    setItems((list) => list.map((item) => (item.id === id ? { ...item, ...patch } : item)));

  const remove = (id) => setItems((list) => list.filter((item) => item.id !== id));

  return { items, add, update, remove };
}
