<template>
  <div class="custom-center">
    <div>
      <el-dropdown placement="right-start">
        <el-button :icon="User" circle class="center-btn"></el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="backHome"> 回到首页 </el-dropdown-item>
            <el-dropdown-item @click="loginOut"> 退出登录 </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <div>
      <el-tooltip effect="customized" content="开启新会话" placement="right">
        <el-button
          :icon="ChatDotRound"
          @click="openChatNew"
          circle
          class="center-btn"
        ></el-button>
      </el-tooltip>
    </div>
    <div>
      <el-tooltip effect="customized" content="历史会话" placement="right">
        <el-button
          :icon="Tickets"
          @click="openChatHistory"
          circle
          class="center-btn"
        ></el-button>
      </el-tooltip>
    </div>
    <div>
      <el-button
        :icon="ifDark ? Moon : Sunny"
        :color="ifDark ? '#626aef' : '#e6a23c'"
        @click="ifDark = !ifDark"
        circle
        class="center-btn"
      ></el-button>
    </div>
  </div>
  <ChatHistory ref="chatHistroyRef" />
</template>
<script setup lang="ts" name="ControlCenter">
import { ref, watch } from "vue";
import { useUserStore } from "@/stores/user";
import { useChatStore } from "@/stores/chat";
import {
  Sunny,
  Moon,
  Tickets,
  ChatDotRound,
  User,
} from "@element-plus/icons-vue"; // 引入图标
import ChatHistory from "@/views/ChatHistory.vue";
import { useRouter } from "vue-router";
import { checkLogin, logout } from "@/api/chatApi";
import { ElMessageBox, ElMessage } from "element-plus";

const useChat = useChatStore();
const router = useRouter();
const chatHistroyRef = ref();
const useUser = useUserStore();
const ifLogin = ref(false);
const backHome = () => {
  router.push("/login");
};
const checkLog = async () => {
  const data = await checkLogin();
  ifLogin.value = data == "已登录" ? true : false;
};
const loginOut = async () => {
  // 登录或登出
  await checkLog();
  if (ifLogin.value) {
    ElMessageBox.confirm("确定退出登录吗？", "退出登录", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
    })
      .then(async () => {
        // 退出登录
        const data = await logout();
        console.log(data);
        router.push({ path: "/login", query: { date: new Date().getTime() } });
      })
      .catch(() => {});
  } else {
    ElMessage.warning("请先登录");
  }
};
const openChatNew = () => {
  //停止当前会话
  useChat.endStream();
  useChat.clearMsgList();
  console.log("openChatNew");
  // 开启新会话，会话title置空
  useUser.chat1stMsg = "";
  useUser.name = "";
  router.push({
    path: "/chat",
    query: { time: Date.now() },
  }); // 替换路由并清除参数
};
const openChatHistory = () => {
  chatHistroyRef.value.open();
};

// 从localStorage获取初始暗黑模式状态，如果没有设置则默认为false
const ifDark = ref(localStorage.getItem("darkMode") === "true");

// 监听 ifDark 的变化，每次变化时更新localStorage中的值
watch(ifDark, () => {
  if (ifDark.value) {
    document.documentElement.classList.add("dark");
    localStorage.setItem("darkMode", "true"); // 保存状态到localStorage
  } else {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("darkMode", "false"); // 保存状态到localStorage
  }
});
</script>
<style>
.el-popper.is-customized {
  /* Set padding to ensure the height is 32px */
  padding: 6px 12px;
  background: black;
  color: white;
}

.el-popper.is-customized .el-popper__arrow::before {
  background: black;
  right: 0;
}
</style>
<style scoped>
.custom-center {
  width: 55px;
  height: 50vh;
  margin-left: 5px;
  background-color: var(--center-bg-color);
  border-radius: 12px;
  box-shadow: rgba(146, 159, 202, 0.19) 2px 2px 7.7px 0px,
    rgba(255, 255, 255, 0.45) 0px 0px 1px 1px inset;
  display: flex;
  /* 启用 Flexbox */
  flex-direction: column;
  /* 子元素竖直排列 */
  align-items: center;
  /* 子元素在容器中垂直居中对齐 */
  justify-content: space-evenly;
  transition: all 0.3s ease;
}

.center-btn {
  width: 90%;
  height: 90%;
  background-size: 100% 100%;
  cursor: pointer;
}
</style>