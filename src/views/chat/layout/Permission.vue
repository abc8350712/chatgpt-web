<!--
 * @Author: yxd abc8350712@gmail.com
 * @Date: 2023-05-28 11:58:10
 * @LastEditors: yxd abc8350712@gmail.com
 * @LastEditTime: 2023-06-11 00:13:56
 * @FilePath: /chatgpt-web/src/views/chat/layout/Permission.vue
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
-->
<script setup lang='ts'>
import { computed, ref } from 'vue'
import { NButton, NInput, NModal, NText } from 'naive-ui'
import { fetchIncreasetChatCount, fetchSecretKey } from '@/api'
import { useUserStore } from '@/store'
import Icon403 from '@/icons/403.vue'

interface Props {
  visible: boolean
}

defineProps<Props>()

const userStore = useUserStore()
const userInfo = computed(() => userStore.userInfo)
const isAuth = computed(() => userInfo.value.expire_datetime > new Date().toISOString())

const loading = ref(false)
const token = ref('')

const disabled = computed(() => !token.value.trim() || loading.value)

async function handleVerify() {
  const secretKey = token.value.trim()

  if (!secretKey)
    return

  // loading.value = true
  // await fetchVerify(secretKey)
  // authStore.setToken(secretKey)
  // ms.success('success')
  const user_name = userInfo.value.name
  const secret_response = await fetchSecretKey(user_name, secretKey)
  loading.value = secret_response.data.isFound
  window.location.reload()
  const newExpireDate = new Date()
  newExpireDate.setDate(newExpireDate.getDate() + 30)

  userStore.updateUserInfo({ auth: true, expire_datetime: newExpireDate.toISOString() })
  userStore.increaseChatCount(100)
  await fetchIncreasetChatCount(userInfo.value.name)
}

function handlePress(event: KeyboardEvent) {
  if (event.key === 'Enter' && !event.shiftKey)
    event.preventDefault()
  handleVerify()
}
</script>

<template>
  <NModal :show="visible" style="width: 90%; max-width: 640px">
    <div class="p-10 bg-white rounded dark:bg-slate-800">
      <div class="space-y-4">
        <header class="space-y-2">
          <h2 class="text-2xl font-bold text-center text-slate-800 dark:text-neutral-200">
            403
          </h2>
          <p class="text-base text-center text-slate-500 dark:text-slate-500">
            {{ $t('common.unauthorizedTips') }}
          </p>

          <Icon403 class="w-[200px] m-auto" />
        </header>
        <!-- 如果是游客，次数到达的时候就需要输入key。  -->
        <!-- 如果是会员 次数到达的时候显示使用次数到达上限，如果是过期的话就需要输入密钥 -->
        <!-- userInfo.auth 这个判断的是登陆 -->
        <span v-if="userInfo.auth">
          <NInput v-if="!isAuth" v-model:value="token" type="password" placeholder="" @keypress="handlePress" />
          <NText v-else>
            <p class="text-base text-center text-slate-500 red:text-slate-500">
              今日使用次数已达上限，请等明天。
            </p>
          </NText>
        </span>
        <span v-else>
          <NInput v-model:value="token" type="password" placeholder="" @keypress="handlePress" />

        </span>

        <NButton
          block
          type="primary"
          :disabled="disabled"
          :loading="loading"
          @click="handleVerify"
        >
          {{ $t('common.verify') }}
        </NButton>
      </div>
    </div>
  </NModal>
</template>
