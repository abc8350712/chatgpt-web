/*
 * @Author: yxd abc8350712@gmail.com
 * @Date: 2023-05-16 21:48:07
 * @LastEditors: yxd abc8350712@gmail.com
 * @LastEditTime: 2023-05-28 13:41:48
 * @FilePath: /chatgpt-web/src/api/index.ts
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import type { AxiosProgressEvent, GenericAbortSignal } from 'axios'
import { post } from '@/utils/request'
import { useAuthStore, useSettingStore } from '@/store'

export function fetchChatAPI<T = any>(
  prompt: string,
  options?: { conversationId?: string; parentMessageId?: string },
  signal?: GenericAbortSignal,
) {
  return post<T>({
    url: '/chat',
    data: { prompt, options },
    signal,
  })
}

export function fetchChatConfig<T = any>() {
  return post<T>({
    url: '/config',
  })
}

export function fetchChatAPIProcess<T = any>(
  params: {
    prompt: string
    options?: { conversationId?: string; parentMessageId?: string }
    signal?: GenericAbortSignal
    onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void },
) {
  const settingStore = useSettingStore()
  const authStore = useAuthStore()

  let data: Record<string, any> = {
    prompt: params.prompt,
    options: params.options,
  }

  if (authStore.isChatGPTAPI) {
    data = {
      ...data,
      systemMessage: settingStore.systemMessage,
      temperature: settingStore.temperature,
      top_p: settingStore.top_p,
    }
  }

  return post<T>({
    url: '/chat-process',
    data,
    signal: params.signal,
    onDownloadProgress: params.onDownloadProgress,
  })
}

export function fetchSession<T>() {
  return post<T>({
    url: '/session',
  })
}

export function fetchGetHash<T>(key: string) {
  return post<T>({
    url: `/api/get_hash/${key}`,
  })
}

export function fetchSecretKey<T>(name: string, key: string) {
  return post<T>({
    url: `/api/get_secret_key/${name}/${key}`,
    data: {
      name,
      key,
    },
  })
}

export function fetchDecreasetChatCount<T>(key: string) {
  return post<T>({
    url: `/api/decrease_chat_count/${key}`,
  })
}

export function fetchUpdateRequesTime<T>() {
  return post<T>({
    url: '/api/update_request_time',
  })
}

export function fetchIncreasetChatCount<T>(key: string) {
  return post<T>({
    url: `/api/increase_chat_count/${key}`,
  })
}

export function fetchRegister<T>(username, requestBody) {
  return post<T>({
    url: `/api/register/${username}`,
    data: requestBody,
  })
}

export function fetchVerify<T>(token: string) {
  return post<T>({
    url: '/verify',
    data: { token },
  })
}
