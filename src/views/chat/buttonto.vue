<!--
 * @Author: yxd3 abc8350712@gmail.com
 * @Date: 2023-05-08 23:14:35
 * @LastEditors: yxd3 abc8350712@gmail.com
 * @LastEditTime: 2023-05-09 21:19:51
 * @FilePath: /chatgpt-web/src/views/chat/buttonto.vue
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
-->
<script>
export default {
  methods: {
    goToPage() {
      this.$router.push('/register')
    },
  },
}
</script>

<template>
  <div>
    <button @click="goToPage">
      点击跳转
    </button>
  </div>
</template>
