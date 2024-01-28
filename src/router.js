
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
    {
        path: '/login',
        name: 'login',
        component: () => import('@/components/pages/Login.vue'),
    },
    {
        path: '/signup',
        name: 'signup',
        component: () => import('@/components/pages/Signup.vue'),
    },
    {
        path: '/forgot-password',
        name: 'forgot-password',
        component: () => import('@/components/pages/ForgotPassword.vue'),
    },
    {
        path: '/reset-password',
        name: 'reset-password',
        component: () => import('@/components/pages/ResetPassword.vue'),
    },
    {
        path: '/',
        name: 'home',
        component: () => import('@/components/pages/Home.vue'),
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;