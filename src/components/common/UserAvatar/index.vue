<!--
 * @Author: yxd abc8350712@gmail.com
 * @Date: 2023-04-30 23:17:02
 * @LastEditors: yxd abc8350712@gmail.com
 * @LastEditTime: 2023-06-08 22:09:55
 * @FilePath: /chatgpt-web/src/components/common/UserAvatar/index.vue
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
-->
<script setup lang='ts'>
import { useRouter } from 'vue-router'
import { computed } from 'vue'
import { NAvatar } from 'naive-ui'
import { useUserStore } from '@/store'
import defaultAvatar from '@/assets/avatar.jpg'
import { isString } from '@/utils/is'

const userStore = useUserStore()

// computed()响应式计算
const userInfo = computed(() => userStore.userInfo)

const router = useRouter()
const goToRegister = () => {
  router.push('/register')
}

const isAuth = computed(() => new Date(userInfo.value.expire_datetime) > new Date())

const goToLogin = () => {
  router.push('/login')
}
defineExpose({
  goToRegister,
  goToLogin,

})
</script>

<template>
  <div class="flex items-center overflow-hidden">
    <div class="w-10 h-10 overflow-hidden rounded-full shrink-0">
      <template v-if="isString(userInfo.avatar) && userInfo.avatar.length > 0">
        <NAvatar
          size="large"
          round
          :src="userInfo.avatar"
          :fallback-src="defaultAvatar"
        />
      </template>
      <template v-else>
        <NAvatar size="large" round :src="defaultAvatar" />
      </template>
    </div>
    <div class="flex-1 min-w-0 ml-2">
      <h2 class="overflow-hidden font-bold text-md text-ellipsis whitespace-nowrap">
        {{ userInfo.name ?? 'Moon' }}
        <span v-if="userInfo.auth">
          <span v-if="isAuth" class="member-badge">会员</span>
          <span v-else class="free-badge">免费用户</span>
        </span>
      </h2>
      <p v-if="!userInfo.auth" class="overflow-hidden ">
        <button ghost color="green" class="bg-green" @click="goToRegister">
          注册
        </button>
        <span class="mx-2">|</span>
        <button ghost color="green" class="bg-green" @click="goToLogin">
          登陆
        </button>
      </p>
      <p v-else class="overflow-hidden ">
        <button ghost color="green" class="bg-green" @click="userStore.resetUserInfo">
          退出
        </button>
      </p>
    </div>
  </div>
</template>

<style scoped>
.member-badge {
  font-size: 12px;
  color: #ff9900;
  margin-left: 5px;
}

.free-badge {
  font-size: 12px;
  color: #808080;
  margin-left: 5px;
}
</style>
