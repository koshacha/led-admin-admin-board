<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import Login from "@/components/icons/Login.vue";

const router = useRouter();
const auth = useAuthStore();

const username = ref("");
const password = ref("");
const error = ref("");

async function handleSubmit() {
  error.value = "";

  try {
    const success = await auth.login(username.value, password.value, "");
    if (success) {
      router.push("/");
    } else {
      error.value = "Неверный логин или пароль";
    }
  } catch (e) {
    error.value = error?.message ?? "Произошла ошибка при входе";
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center">
    <Card
      class="w-full max-w-md space-y-8 p-8 max-md:shadow-[unset] max-md:border-0"
    >
      <CardHeader>
        <div class="flex flex-col space-y-2 text-center">
          <h2 class="text-2xl font-semibold tracking-tight">
            Вход в панель управления
          </h2>
        </div>
      </CardHeader>
      <form @submit.prevent="handleSubmit">
        <CardContent class="space-y-4">
          <div>
            <label for="username" class="block text-sm font-medium mb-1"
              >Логин</label
            >
            <Input
              id="username"
              v-model="username"
              type="text"
              required
              autocomplete="username"
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium mb-1"
              >Пароль</label
            >
            <Input
              id="password"
              v-model="password"
              type="password"
              required
              autocomplete="current-password"
            />
          </div>
        </CardContent>

        <CardFooter class="flex flex-col space-y-4">
          <Button type="submit" class="w-full"> <Login /> Войти </Button>
          <div v-if="error" class="text-red-500 text-sm">
            {{ error }}
          </div>
        </CardFooter>
      </form>
    </Card>
  </div>
</template>
