<!--
 * @Author: yxd abc8350712@gmail.com
 * @Date: 2023-05-23 21:45:27
 * @LastEditors: yxd abc8350712@gmail.com
 * @LastEditTime: 2023-05-27 12:36:47
 * @FilePath: /chatgpt-web/src/views/chat/layout/Layout.vue
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
-->
<script setup lang='ts'>
import { computed } from 'vue'
import { NLayout, NLayoutContent } from 'naive-ui'
import { useRouter } from 'vue-router'
import Sider from './sider/index.vue'
import Permission from './Permission.vue'
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { useAppStore, useAuthStore, useChatStore, useUserStore } from '@/store'

const userStore = useUserStore()
const userInfo = computed(() => userStore.userInfo)
const router = useRouter()
const appStore = useAppStore()
const chatStore = useChatStore()
const authStore = useAuthStore()

router.replace({ name: 'Chat', params: { uuid: chatStore.active } })

const { isMobile } = useBasicLayout()

const collapsed = computed(() => appStore.siderCollapsed)

// yxd: 用户的auth存在，且auth 为true
// const needPermission = computed(() => !!authStore.session?.auth && !authStore.token)

// 会员每天的次数与非会员不一样
// 请求时，确认下当前时候与上次请求的的时间是否不在同一天，如果不在同一天，需要重置次数。
// 请求时，确认下上次请求时间是否过期，如果过期，不用处理。确认下当前时间是否是过期，如果过期，重置远端的数据(如何只重置一次？)
const needPermission = computed(() => {
  // console.log('count: ', userInfo.value.free_count)
  return userInfo.value.name !== '游客' && userInfo.value.free_count === 0
})

const getMobileClass = computed(() => {
  if (isMobile.value)
    return ['rounded-none', 'shadow-none']
  return ['border', 'rounded-md', 'shadow-md', 'dark:border-neutral-800']
})

const getContainerClass = computed(() => {
  return [
    'h-full',
    { 'pl-[260px]': !isMobile.value && !collapsed.value },
  ]
})
</script>

<template>
  <div class="h-full dark:bg-[#24272e] transition-all" :class="[isMobile ? 'p-0' : 'p-4']">
    <div class="h-full overflow-hidden" :class="getMobileClass">
      <NLayout class="z-40 transition" :class="getContainerClass" has-sider>
        <Sider />
        <NLayoutContent class="h-full">
          <RouterView v-slot="{ Component, route }">
            <component :is="Component" :key="route.fullPath" />
          </RouterView>
        </NLayoutContent>
      </NLayout>
    </div>
    <Permission :visible="needPermission" />
  </div>
</template>
