const cache = new Map();

// نخزّن الطلب نفسه لا نتيجته، فلا يتكرر الطلب لو طلبته أكثر من صفحة معًا
export function getJson(url) {
  if (!cache.has(url)) {
    const request = fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .catch((err) => {
        cache.delete(url);
        throw err;
      });
    cache.set(url, request);
  }
  return cache.get(url);
}
