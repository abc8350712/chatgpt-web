import type { App } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import { setupPageGuard } from './permission'
import { ChatLayout } from '@/views/chat/layout'
/*
实际上，ChatLayout 组件会被渲染，但它可能作为一个容器或者布局组件，在该组件内部，重定向的 '/chat' 路径对应的子路由（即 'Chat'）才渲染子组件。
通常，在一个 Vue 应用程序中，ChatLayout 组件可以包含一个 `<router-view>` 标签，用于渲染子路由对应的组件。在这种情况下，ChatLayout 仍然会展示，但它的 `<router-view>` 部分会被子路由的组件（这里是 'Chat'）替换。
所以，当访问 '/' 路径时，首先渲染 ChatLayout 组件，然后重定向到 '/chat'，在 ChatLayout 的 `<router-view>` 标签内部渲染 Chat 子路由对应的组件。这样并没有抛弃 ChatLayout，而是将它作为一个容器或基本布局来使用。
*/
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Root',
    component: ChatLayout,
    redirect: '/chat',
    children: [
      {
        path: '/chat/:uuid?',
        name: 'Chat',
        component: () => import('@/views/chat/index.vue'),
      },
    ],
  },

  {
    path: '/404',
    name: '404',
    component: () => import('@/views/exception/404/index.vue'),
  },

  {
    path: '/500',
    name: '500',
    component: () => import('@/views/exception/500/index.vue'),
  },

  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/chat/login.vue'),
  },

  {
    path: '/:pathMatch(.*)*',
    name: 'notFound',
    redirect: '/404',
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ left: 0, top: 0 }),
})

setupPageGuard(router)

export async function setupRouter(app: App) {
  app.use(router)
  await router.isReady()
}
