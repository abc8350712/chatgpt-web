/*
 * @Author: yxd3 abc8350712@gmail.com
 * @Date: 2023-04-30 23:17:02
 * @LastEditors: yxd abc8350712@gmail.com
 * @LastEditTime: 2023-05-28 10:20:46
 * @FilePath: /chatgpt-web/src/store/modules/user/index.ts
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import { defineStore } from 'pinia'
import type { UserInfo, UserState } from './helper'
import { defaultSetting, getLocalState, setLocalState } from './helper'

export const useUserStore = defineStore('user-store', {
  state: (): UserState => getLocalState(),
  actions: {
    updateUserInfo(userInfo: Partial<UserInfo>) {
      this.userInfo = { ...this.userInfo, ...userInfo }
      this.recordState()
    },

    resetUserInfo() {
      this.userInfo = { ...defaultSetting().userInfo }
      this.recordState()
    },

    recordState() {
      setLocalState(this.$state)
    },

    updateChatCount(count: number) {
      this.userInfo.free_count = count
      this.recordState()
    },
    increaseChatCount(val: number) {
      this.userInfo.free_count += val
      this.recordState()
    },

  },
})
