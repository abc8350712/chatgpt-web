<script lang="ts">
import axios from 'axios'
import { useUserStore } from '@/store'

const userStore = useUserStore()
// const name = ref(userInfo.value.name ?? '')

export default {
  data() {
    return {
      username: '',
      password: '',
      usernameError: '',
      passwordError: '',
    }
  },
  methods: {
    async getHashByKey(username: string) {
      const response = await axios.get(`http://localhost:3002/api/get_hash/${username}`)
      // 检查数据是否存在，根据需要调整条件
      if (response.data
          && response.data.hash
          && Object.keys(response.data.hash).length > 0)

        return true

      else

        return false
    },
    validateUsername() {
      if (!this.username) {
        this.usernameError = 'Username is required'
        return false
      }
      return true
    },
    async validatePassword(username: string) {
      if (!this.password) {
        this.passwordError = 'Password is required'
        return false
      }
      else {
        const response = await axios.get(`http://localhost:3002/api/get_hash/${username}`)
        const password = response.data.hash.password

        if (this.password !== password) {
          this.passwordError = 'Password is not match'
          return false
        }
      }

      return true
    },
    async handleSubmit() {
      if (this.validateUsername() && (await this.validatePassword(this.username)) && (await this.getHashByKey(this.username))) {
        userStore.updateUserInfo({ name: this.username, auth: true })
        this.$router.push({ path: '/' })
      }

      // 在这里添加登录成功后需要执行的代码
    },
  },
}
</script>

<template>
  <div class="login-container">
    <h2>Login</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-item">
        <label for="username">Username</label>
        <input
          id="username"
          v-model.trim="username"
          type="text"
          placeholder="Enter your username"
          @blur="validateUsername"
        >
        <div v-if="usernameError" class="error">
          {{ usernameError }}
        </div>
      </div>
      <div class="form-item">
        <label for="password">Password</label>
        <input
          id="password"
          v-model.trim="password"
          type="password"
          placeholder="Enter your password"
          @blur="validatePassword"
        >
        <div v-if="passwordError" class="error">
          {{ passwordError }}
        </div>
      </div>
      <button class="login-button" type="submit">
        Login
      </button>
    </form>
  </div>
</template>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 0 auto;
}
.form-item {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}
input {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.error {
  color: red;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}
.login-button {
  background-color: #007BFF;
  border: none;
  color: white;
  padding: 12px 25px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 5px 2px;
  cursor: pointer;
  border-radius: 25px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
  transition: all 0.3s;
}
.login-button:hover {
  background-color: #0056b3;
  color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}
</style>
