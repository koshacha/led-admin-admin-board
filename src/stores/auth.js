import { defineStore } from "pinia";
import { ref } from "vue";

export const useAuthStore = defineStore("auth", () => {
  const token = ref(localStorage.getItem("token"));
  const isAuthenticated = ref(!!token.value);

  async function login(username, password, grecaptcha = "") {
    try {
      const response = await fetch(
        "https://led-kacheli.ru/handle.php?action=auth",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
            "g-recaptcha-response": grecaptcha,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Ошибка авторизации");
      }

      var data = await response.json();
      token.value = data.token;
      isAuthenticated.value = true;
      localStorage.setItem("token", data.token);

      return true;
    } catch (error) {
      console.error("Ошибка авторизации:", error);
      return false;
    }
  }

  function logout() {
    token.value = null;
    isAuthenticated.value = false;
    localStorage.removeItem("token");
  }

  return {
    token,
    isAuthenticated,
    login,
    logout,
  };
});
