
import { createRouter, createWebHistory } from 'vue-router';
import { auth } from '../firebase';

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
        meta: {
            requiresAuth: true
        }
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

const getCurrentUser = () => {
    return new Promise((resolve, reject) => {
        const removeListener = auth.onAuthStateChanged(user => {
            removeListener();
            resolve(user);
        }, reject);
    });

}

router.beforeEach(async (to, from, next) => {
    if(to.matched.some(record => record.meta.requiresAuth)){
        if(await getCurrentUser()){
            next();
        } else {    
            next('/login');
        }
    } else {
        next();
    }
});
export default router;