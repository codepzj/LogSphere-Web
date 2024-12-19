<template>
  <div class="flex justify-center items-center h-screen">
    <div
      class="w-3/5 md:w-1/2 lg:w-1/4 h-3/10 bg-slate-50 box-border p-8 shadow-md rounded-md"
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
        <n-form-item
          ref="rPasswordFormItemRef"
          first
          path="reenteredPassword"
          label="重复密码"
        >
          <n-input
            v-model:value="model.reenteredPassword"
            :disabled="!model.password"
            placeholder="请重新输入密码"
            type="password"
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
              注册
            </n-button>
          </div>
          <div>
            <a href="/login" class="text-green-500">以有账号？马上登录</a>
          </div>
        </div>
      </n-form>
    </div>
  </div>
</template>

<script>
import { useMessage } from "naive-ui";
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import { UserRegister } from "@/api/userAPI";

export default defineComponent({
  setup() {
    const message = useMessage();
    const formRef = ref(null);
    const rPasswordFormItemRef = ref(null);
    const router = useRouter();
    const modelRef = ref({
      account: null,
      password: null,
      reenteredPassword: null,
    });
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
      reenteredPassword: [
        {
          required: true,
          message: "请再次输入密码",
          trigger: ["input", "blur"],
        },
        {
          validator: validatePasswordStartWith,
          message: "两次密码输入不一致",
          trigger: "input",
        },
        {
          validator: validatePasswordSame,
          message: "两次密码输入不一致",
          trigger: ["blur", "password-input"],
        },
      ],
    };
    function validatePasswordStartWith(rule, value) {
      return (
        !!modelRef.value.password &&
        modelRef.value.password.startsWith(value) &&
        modelRef.value.password.length >= value.length
      );
    }
    function validatePasswordSame(rule, value) {
      return value === modelRef.value.password;
    }
    const Register = async () => {
      try {
        const data = await UserRegister(modelRef.value);
        if (data.code === 0) {
          message.success("注册成功，请登录");
          router.push({ name: "Login" });
        } else {
          message.error(`注册失败，${data.msg}`);
        }
      } catch (error) {
        message.error("注册失败，请重试");
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
            Register();
          } else {
            console.log(errors);
            message.error("验证失败");
          }
        });
      },
    };
  },
});
</script>
