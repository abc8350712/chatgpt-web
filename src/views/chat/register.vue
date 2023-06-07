<script lang="ts">
import { useUserStore } from '@/store'
import { fetchRegister } from '@/api'

const userStore = useUserStore()

interface HashResponse {
  message: string
  isUsernameExists: boolean
  isEmailExists: boolean
}
export default {
  data() {
    return {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      usernameError: '',
      usernameExistsError: '',
      emailError: '',
      emailExistsErrors: '',
      passwordError: '',
      confirmPasswordError: '',
      requestTime: '',
      expireTime: '',
      isUserExists: 0,
      isEmailExists: 0,
    }
  },
  async mounted() {
    // console.log('User registered:')

    // const url = 'http://localhost:3002/api/register'
    // const requestBody = {
    //   username: 'abc8312',
    //   email: 'dfdsdf@qq.com',
    //   password: '234234',
    // }
    // const response = await axios.post(url, requestBody)
    // console.log('User registered:')
  },
  methods: {

    async register() {
      const response = await fetchRegister<HashResponse>(this.username, {
        username: this.username,
        email: this.email,
        password: this.password,
      })

      // const { key, hash, isUsernameExists, isEmailExists } = response.data
      // console.log('log', isUsernameExists, isEmailExists)
      // this.isUserExists = isUsernameExists
      // this.isEmailExists = isEmailExists
      return response.data
    },

    validateUsername() {
      // 还需要验证邮箱是否已经存在
      if (!this.username) {
        this.usernameError = 'Username is required'
        return false
      }
      return true
    },

    validateEmail() {
      // 需要验证邮箱是否已经存在
      const re = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/
      if (re.test(this.email)) {
        this.emailError = ''
        return true
      }

      this.emailError = 'Please enter a valid email'

      return false
    },
    validatePassword() {
      // if (this.password < 6) {
      //   this.passwordError = 'Password must be at least 6 characters'
      //   return false
      // }
      return true
    },
    validateConfirmPassword() {
      if (this.confirmPassword !== this.password) {
        this.confirmPasswordError = 'Passwords do not match'
        return false
      }
      return true
    },
    async handleSubmit() {
      this.validateUsername()
      this.validateEmail()
      this.validatePassword()
      this.validateConfirmPassword()
      if (
        this.validateUsername()
        && this.validateEmail()
        && this.validatePassword()
        && this.validateConfirmPassword()
      ) {
        const response = await this.register()
        this.isUserExists = response.isUsernameExists
        this.isEmailExists = response.isEmailExists
        if (this.isEmailExists)
          this.emailExistsErrors = 'Email already exists !'
        else
          this.emailExistsErrors = ''
        if (this.isUserExists)
          this.usernameExistsError = 'User already exists !'
        else this.usernameExistsError = ''

        if (!this.isEmailExists && !this.isUserExists) {
          userStore.updateUserInfo({ name: this.username, auth: true, free_count: 5 })
          // const data = await response.json()
          this.$router.push({ path: '/' },
          )
        }
      }

      // console.log("Username:", this.username);
      // console.log("Email:", this.email);
      // console.log("Password:", this.password);
      // 这里可以添加提交表单后需要的逻辑
    },
  },
}
</script>

<template>
  <div class="register-container">
    <form @submit.prevent="handleSubmit">
      <div class="form-item">
        <label for="username">Username</label>
        <input
          id="username" v-model.trim="username" type="text" placeholder="Enter your username"
          @blur="validateUsername"
        >
        <div v-if="usernameError" class="error">
          {{ usernameError }}
        </div>
        <div v-else-if="isUserExists" class="error">
          {{ usernameExistsError }}
        </div>
      </div>
      <div class="form-item">
        <label for="email">Email</label>
        <input id="email" v-model.trim="email" type="email" placeholder="Enter your email" @blur="validateEmail">
        <div v-if="emailError" class="error">
          {{ emailError }}
        </div>
        <div v-else-if="emailExistsErrors" class="error">
          {{ emailExistsErrors }}
        </div>
      </div>
      <div class="form-item">
        <label for="password">Password</label>
        <input
          id="password" v-model.trim="password" type="password" placeholder="Enter your password"
          @blur="validatePassword"
        >
        <div v-if="passwordError" class="error">
          {{ passwordError }}
        </div>
      </div>
      <div class="form-item">
        <label for="confirm-password">Confirm Password</label>
        <input
          id="confirm-password" v-model.trim="confirmPassword" type="password" placeholder="Confirm your password"
          @blur="validateConfirmPassword"
        >
        <div v-if="confirmPasswordError" class="error">
          {{ confirmPasswordError }}
        </div>
      </div>
      <button class="register-button" type="submit">
        Register
      </button>
    </form>
  </div>
</template>

<style scoped>
.register-container {
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

.register-button {
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

.register-button:hover {
  background-color: #0056b3;
  color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}
</style>
