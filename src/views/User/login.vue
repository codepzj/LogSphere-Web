<template>
  <div class="flex justify-center items-center h-screen">
    <div
      class="w-3/5 md:w-1/2 lg:w-1/3 h-3/10 bg-slate-50 box-border p-8 shadow-md rounded-md"
    >
      <div class="text-xl text-center font-bold my-4">LogSphere</div>
      <n-form ref="formRef" :model="model" :rules="rules">
        <n-form-item path="account" label="账号">
          <n-input
            v-model:value="model.account"
            placeholder="请输入账号"
            @keydown.enter.prevent
          />
        </n-form-item>
        <n-form-item path="password" label="密码">
          <n-input
            v-model:value="model.password"
            placeholder="请输入密码"
            type="password"
            @input="handlePasswordInput"
            @keydown.enter.prevent
          />
        </n-form-item>
        <div class="flex flex-col justify-around items-center h-16">
          <div>
            <n-button
              :disabled="model.account === null"
              round
              type="primary"
              class="w-24"
              @click="handleValidateButtonClick"
            >
              登录
            </n-button>
          </div>
          <div>
            <a href="/register" class="text-green-500">还没有账号？马上注册</a>
          </div>
        </div>
      </n-form>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import { UserLogin } from "@/api/userAPI";
import { useMessage } from "naive-ui";
import { userStore } from "@/store/userStore";

export default defineComponent({
  setup() {
    const message = useMessage();
    const formRef = ref(null);
    const rPasswordFormItemRef = ref(null);
    const modelRef = ref({
      account: null,
      password: null,
    });
    const router = useRouter();
    const { setUserInfo } = userStore();
    const rules = {
      account: [
        {
          required: true,
          validator(rule, value) {
            if (!value) {
              return new Error("需要账号");
            }
            return true;
          },
          trigger: ["input", "blur"],
        },
      ],
      password: [
        {
          required: true,
          message: "请输入密码",
        },
      ],
    };
    const Login = async () => {
      try {
        const data = await UserLogin(modelRef.value);
        if (data.code === 0) {
          message.success("登录成功");
          // 使用pinia来存储返回的用户信息
          console.log(data.data);
          setUserInfo(data.data)
          router.push({ name: "Home" });
        } else {
          message.error(`登录失败，${data.msg}`);
        }
      } catch (error) {
        message.error("登录失败，请重试");
      }
    };
    return {
      formRef,
      rPasswordFormItemRef,
      model: modelRef,
      rules,
      handlePasswordInput() {
        if (modelRef.value.reenteredPassword) {
          rPasswordFormItemRef.value?.validate({ trigger: "password-input" });
        }
      },
      handleValidateButtonClick(e) {
        e.preventDefault();
        formRef.value?.validate(errors => {
          if (!errors) {
            Login();
          } else {
            message.error("验证失败");
          }
        });
      },
    };
  },
});
</script>
