import {
  createRouter,
  createWebHistory,
  createMemoryHistory,
} from "vue-router";
import { useAuthStore } from "@/stores/auth";

const router = createRouter({
  history: createMemoryHistory("/admin/"),
  routes: [
    {
      path: "/login",
      name: "login",
      component: () => import("@/views/LoginView.vue"),
      meta: { requiresAuth: false },
    },
    {
      path: "/",
      name: "home",
      component: () => import("@/views/HomeView.vue"),
      meta: { requiresAuth: true },
    },
  ],
});

router.beforeEach((to, from, next) => {
  const auth = useAuthStore();

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    next("/login");
  } else if (to.path === "/login" && auth.isAuthenticated) {
    next("/");
  } else {
    next();
  }
});

export default router;
