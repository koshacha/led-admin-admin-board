import { defineStore } from "pinia";
import { ref } from "vue";

// const defaultPrices = {
//   "Без вращения": {
//     "Без каркаса": {
//       Разноцветная: 69999,
//       Белая: 69999,
//     },
//     Стойка: 79990,
//     Бриз: 210000,
//     Радуга: 739000,
//     Олимпия: 520000,
//     Круг: 702000,
//     Орион: 2780000,
//     Омега: 3300000,
//     Каракурт: 1200000,
//   },
//   "Вращение на 360": {
//     "Без каркаса": {
//       Разноцветная: 74999,
//       Белая: 74999,
//     },
//     Стойка: 82990,
//     Бриз: 235000,
//     Радуга: 750000,
//     Олимпия: 540000,
//     Круг: 730000,
//     Орион: 2781000,
//     Омега: 3350000,
//     Каракурт: 1220000,
//   },
// };

export const usePricesStore = defineStore("prices", () => {
  const prices = ref(null);
  const loading = ref(false);
  const error = ref(null);

  async function fetchPrices() {
    loading.value = true;
    error.value = null;

    try {
      const response = await fetch("https://led-kacheli.ru/prices.json");
      if (!response.ok) throw new Error("Ошибка загрузки цен");
      prices.value = await response.json();
    } catch (e) {
      error.value = e.message;
      // prices.value = defaultPrices;
    } finally {
      loading.value = false;
    }
  }

  async function savePrices() {
    loading.value = true;
    error.value = null;

    try {
      const response = await fetch(
        "https://led-kacheli.ru/handle.php?action=save",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(prices.value),
        }
      );

      if (!response.ok) throw new Error("Ошибка сохранения цен");

      const result = await response.json();
      return result;
    } catch (e) {
      error.value = e.message;
      throw e;
    } finally {
      loading.value = false;
    }
  }

  return {
    prices,
    loading,
    error,
    fetchPrices,
    savePrices,
  };
});
