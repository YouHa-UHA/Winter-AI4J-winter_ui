<template>
    <div class="container">
        <div style="margin: 30vh auto;">
            <div class="message title-message">
                <p>{{ messages }}</p>
            </div>
            <el-card class="input-card">
                <div class="footer">
                    <el-input v-model="inputMessage" placeholder="请输入内容" class="chat-input" :rows="2" type="textarea"
                        @keyup.enter="sendMessage" />
                    <el-button type="primary" @click="sendMessage" class="send-button">发送</el-button>
                </div>
                <template #footer>
                    <el-button type="warning" plain>功能1</el-button>
                    <el-button type="success" plain>功能2</el-button>
                </template>
            </el-card>
        </div>
    </div>
</template>
<script setup lang="ts" name="ChatHome">
import { ref, onMounted } from "vue";
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import * as ChatApi from '@/api/chatApi'

const useUser = useUserStore()
const inputMessage = ref("");
const titleContent = ref("欢迎使用WinterAI！今天从哪里开始呢？")
const router = useRouter()

const sendMessage = async () => {
    //获取对话信息，存储到pinia
    const res = await ChatApi.getChatId({
        userID: "111111"
    })
    const { data } = res.data
    useUser.chatId = data
    router.push({ path: '/chat', query: { chatTitle: inputMessage.value.substring(0, 5) } })
    inputMessage.value = ""; // 清空输入框
};
const messages = ref('');
const typingSpeed = 100;
// 逐字显示消息的函数
const typeMessage = (message: string) => {
    let displayedMessage = '';  // 单条消息的局部变量
    let index = 0;

    const interval = setInterval(() => {
        if (index < message.length) {
            displayedMessage += message[index];
            messages.value = displayedMessage;
            index++;
        } else {
            clearInterval(interval);  // 消息显示完毕时清除定时器
        }
    }, typingSpeed);
};
onMounted(() => {
    typeMessage(titleContent.value)
});
</script>

<style scoped>
:deep(.el-textarea__inner) {
    box-shadow: none;
    resize: none;
}

/* 消息内容的样式 */
.message {
    word-wrap: break-word;
}

/* 用户消息，靠右对齐 */
.title-message {
    color: black;
    font-size: 30px;
    text-align: center;
    bold: bold;
    margin: auto;
    order: 2;
}

.footer {
    display: flex;
    gap: 10px;
    align-items: center;
}

.input-card {
    border-radius: 20px;
    width: 60vw;
}

.container {
    display: flex;
    height: 100vh;
    width: 100%;
    background-color: #f1f6ff;
}
</style>