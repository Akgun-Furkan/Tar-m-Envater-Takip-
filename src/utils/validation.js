// Form doğrulama: { error } veya { data } döner

const isValidNumber = (value) =>
  value !== "" && Number.isFinite(Number(value)) && Number(value) >= 0;

export function validateProduct(values) {
  const { name, category, size, stock, cost, price } = values;

  if (!name.trim() || !category.trim()) {
    return { error: "Ürün adı ve kategori zorunludur." };
  }
  if (![stock, cost, price].every(isValidNumber)) {
    return { error: "Stok, maliyet ve fiyat 0 veya daha büyük bir sayı olmalıdır." };
  }
  return {
    data: {
      name: name.trim(),
      category: category.trim(),
      size: size.trim(),
      stock: Number(stock),
      cost: Number(cost),
      price: Number(price),
    },
  };
}

export function validateFeed(values) {
  const { name, stock, cost, daily, critical, lastAdded } = values;

  if (!name.trim()) {
    return { error: "Yem adı zorunludur." };
  }
  if (![stock, cost, daily, critical].every(isValidNumber)) {
    return { error: "Stok, birim maliyet, günlük tüketim ve kritik seviye geçerli birer sayı olmalıdır." };
  }
  return {
    data: {
      name: name.trim(),
      stock: Number(stock),
      cost: Number(cost),
      daily: Number(daily),
      critical: Number(critical),
      lastAdded,
    },
  };
}

export function validateCompanyEntry(values) {
  const { name, type, amount, date } = values;

  if (!name.trim()) {
    return { error: "Gelir veya gider kalemi zorunludur." };
  }
  if (!["income", "expense"].includes(type)) {
    return { error: "Geçerli bir işlem türü seçin." };
  }
  if (!isValidNumber(amount) || Number(amount) === 0) {
    return { error: "Tutar 0'dan büyük bir sayı olmalıdır." };
  }
  if (!date) {
    return { error: "İşlem tarihi zorunludur." };
  }
  return {
    data: {
      name: name.trim(),
      type,
      amount: Number(amount),
      date,
    },
  };
}
