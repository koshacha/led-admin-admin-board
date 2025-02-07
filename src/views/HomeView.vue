<script setup>
import { onMounted, ref, watch, nextTick } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { usePricesStore } from "@/stores/prices";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Logout from "@/components/icons/Logout.vue";
import Shop from "@/components/icons/Shop.vue";

const router = useRouter();
const auth = useAuthStore();
const pricesStore = usePricesStore();

const editingPrice = ref(null);
const saveStatus = ref("");
const showStatus = ref(false);

onMounted(() => {
  pricesStore.fetchPrices();
});

function handleLogout() {
  auth.logout();
  router.push("/login");
}

function startEditing(rotation, model, color, price) {
  editingPrice.value = {
    rotation,
    model,
    color,
    price: String(price),
  };
}

const timer = ref(null);

async function handleSave() {
  try {
    timer.value && clearTimeout(timer.value);
    if (editingPrice.value) {
      const { rotation, model, color, price } = editingPrice.value;
      if (color) {
        pricesStore.prices[rotation][model][color] = Number(price);
      } else {
        pricesStore.prices[rotation][model] = Number(price);
      }
      editingPrice.value = null;
    }

    await pricesStore.savePrices();
    saveStatus.value = "Цены успешно сохранены";
    showStatus.value = true;
  } catch (error) {
    console.log(error);
    saveStatus.value = "Ошибка при сохранении";
    showStatus.value = true;
  } finally {
    timer.value = setTimeout(() => {
      showStatus.value = false;
    }, 1500);
  }
}
</script>

<template>
  <div class="min-h-screen">
    <header class="border-b py-4 md:p-4">
      <div class="container mx-auto flex items-center justify-between">
        <h1 class="text-sm md:text-xl font-bold">Редактор цен</h1>
        <div class="flex items-center gap-2 md:gap-4">
          <Button variant="ghost" as-child>
            <a href="/" target="_blank">
              <Shop class="md:hidden" />
              <span class="max-md:hidden">Перейти на сайт</span>
            </a>
          </Button>
          <Button variant="outline" @click="handleLogout">
            <Logout /> Выйти
          </Button>
        </div>
      </div>
    </header>

    <main class="container mx-auto p-6">
      <div v-if="pricesStore.loading" class="text-center py-8">Загрузка...</div>

      <div v-else-if="pricesStore.error" class="text-red-500 text-center py-8">
        {{ pricesStore.error }}
      </div>

      <div v-else-if="pricesStore.prices">
        <Tabs default-value="Без вращения" class="max-w-2xl mx-auto">
          <TabsList class="max-md:w-full">
            <TabsTrigger
              v-for="(rotationData, rotation) in pricesStore.prices"
              :key="rotation"
              :value="rotation"
              >{{ rotation }}</TabsTrigger
            >
          </TabsList>
          <TabsContent
            v-for="(rotationData, rotation) in pricesStore.prices"
            :key="rotation"
            :value="rotation"
            class="space-y-4"
          >
            <!-- <h2 class="text-lg font-medium">{{ rotation }}</h2>
            <p class="text-sm text-muted-foreground">
              This is how others will see you on the site.
            </p> -->

            <div class="grid gap-4">
              <div
                v-for="(value, model) in rotationData"
                :key="model"
                class="border rounded-lg p-4 shadow-sm"
              >
                <div
                  class="flex flex-col md:flex-row md:items-center justify-between"
                >
                  <h3 class="font-medium mb-5">{{ model }}</h3>

                  <div class="space-y-2" v-if="typeof value === 'object'">
                    <div
                      v-for="(price, color) in value"
                      :key="color"
                      class="flex items-center gap-2 justify-between"
                    >
                      <span
                        class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >{{ color }}:</span
                      >
                      <div
                        v-if="
                          editingPrice?.rotation === rotation &&
                          editingPrice?.model === model &&
                          editingPrice?.color === color
                        "
                      >
                        <div class="flex items-center gap-2 justify-between">
                          <Input
                            v-model="editingPrice.price"
                            type="number"
                            class="w-32"
                          />
                          <Button size="sm" @click="handleSave"
                            >Сохранить</Button
                          >
                        </div>
                      </div>
                      <div
                        v-else
                        class="flex items-center gap-2 justify-between"
                      >
                        <span class="font-mono"
                          >{{ price.toLocaleString() }} ₽</span
                        >
                        <Button
                          size="sm"
                          variant="outline"
                          @click="startEditing(rotation, model, color, price)"
                        >
                          Изменить
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div v-else>
                    <div
                      v-if="
                        editingPrice?.rotation === rotation &&
                        editingPrice?.model === model
                      "
                    >
                      <div class="flex items-center gap-2 justify-between">
                        <Input
                          v-model="editingPrice.price"
                          type="number"
                          class="w-32"
                        />
                        <Button size="sm" @click="handleSave">Сохранить</Button>
                      </div>
                    </div>
                    <div v-else class="flex items-center gap-2 justify-between">
                      <span class="font-mono"
                        >{{ value.toLocaleString() }} ₽</span
                      >
                      <Button
                        size="sm"
                        variant="outline"
                        @click="startEditing(rotation, model, null, value)"
                      >
                        Изменить
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="transform translate-y-2 opacity-0"
        enter-to-class="transform translate-y-0 opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="transform translate-y-0 opacity-100"
        leave-to-class="transform translate-y-2 opacity-0"
      >
        <div
          v-if="showStatus"
          class="fixed bottom-4 right-4 p-4 rounded-lg"
          :class="{
            'bg-green-100 text-green-800': !saveStatus.includes('Ошибка'),
            'bg-red-100 text-red-800': saveStatus.includes('Ошибка'),
          }"
        >
          {{ saveStatus }}
        </div>
      </Transition>
    </main>
  </div>
</template>
