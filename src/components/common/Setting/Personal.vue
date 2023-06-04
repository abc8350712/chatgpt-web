<!--
 * @Author: yxd abc8350712@gmail.com
 * @Date: 2023-06-04 12:49:50
 * @LastEditors: yxd abc8350712@gmail.com
 * @LastEditTime: 2023-06-04 16:17:30
 * @FilePath: /chatgpt-web/src/components/common/Setting/Personal.vue
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
-->
<script setup lang='ts'>
import { computed, onMounted, ref } from 'vue'
import { NSpin } from 'naive-ui'
import { fetchChatConfig } from '@/api'
import { useUserStore } from '@/store'

interface ConfigState {
  timeoutMs?: number
  reverseProxy?: string
  apiModel?: string
  socksProxy?: string
  httpsProxy?: string
  usage?: string
}
const userStore = useUserStore()
// const authStore = useAuthStore()
const userInfo = computed(() => userStore.userInfo)

const loading = ref(false)

const config = ref<ConfigState>()

async function fetchConfig() {
  try {
    loading.value = true
    const { data } = await fetchChatConfig<ConfigState>()
    config.value = data
  }
  finally {
    loading.value = false
  }
}

function formatDate(datetime) {
  const expireDatetime = new Date(datetime)

  const year = expireDatetime.getFullYear()
  const month = String(expireDatetime.getMonth() + 1).padStart(2, '0') // 月份从0开始，所以需要加1
  const day = String(expireDatetime.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

onMounted(() => {
  fetchConfig()
})
</script>

<template>
  <NSpin :show="loading">
    <div class="p-4 space-y-4">
      <p>用户： {{ userInfo.name }}</p>
      <p>当日剩余次数： {{ userInfo.free_count }}</p>
      <p v-if="userInfo.auth">
        会员到期时间： {{ formatDate(userInfo.expire_datetime) }}
      </p>
    </div>
  </NSpin>
</template>
