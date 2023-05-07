<script>
export default {
  data() {
    return {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      usernameError: '',
      emailError: '',
      passwordError: '',
      confirmPasswordError: '',
    }
  },
  methods: {
    validateUsername() {
      this.usernameError = this.username.length < 3 ? 'Username must be at least 3 characters' : ''
    },
    validateEmail() {
      const re = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/
      this.emailError = re.test(this.email) ? '' : 'Please enter a valid email'
    },
    validatePassword() {
      this.passwordError = this.password.length < 6 ? 'Password must be at least 6 characters' : ''
    },
    validateConfirmPassword() {
      this.confirmPasswordError = this.confirmPassword !== this.password ? 'Passwords do not match' : ''
    },
    handleSubmit() {
      this.validateUsername()
      this.validateEmail()
      this.validatePassword()
      this.validateConfirmPassword()
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
    <h2>Register</h2>
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
      </div>
      <div class="form-item">
        <label for="email">Email</label>
        <input id="email" v-model.trim="email" type="email" placeholder="Enter your email" @blur="validateEmail">
        <div v-if="emailError" class="error">
          {{ emailError }}
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
