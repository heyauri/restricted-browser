import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        component: () => import('layouts/MainLayout.vue'),
        children: [
            { name: "main", path: 'main', component: () => import('pages/Index.vue') },
            { name: "about", path: 'about', component: () => import('pages/About.vue') },
            { path: "/", redirect: { name: "main" } }
        ],
    },

    // Always leave this as last one,
    // but you can also remove it
    {
        path: '/:catchAll(.*)*',
        component: () => import('pages/ErrorNotFound.vue'),
    },
];

export default routes;
