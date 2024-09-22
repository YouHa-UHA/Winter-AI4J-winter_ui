<template>
    <el-container class="container">
        <!-- 顶部标题和菜单 -->
        <el-header class="header">

        </el-header>

        <!-- 中间聊天内容 -->
        <el-main class="chat-container">
            <div class="message-container">
                <div v-for="(message, index) in displayMessages" :key="index" class="message-wrapper">
                    <!-- 用户消息头像（在左边） -->
                    <el-icon v-if="message.from === 'user'" class="avatar user-avatar">
                        <User />
                    </el-icon>
                    <div :class="getMessageClass(message)">
                        <p>{{ message.text }}</p>
                    </div>
                    <!-- 服务器消息头像（在右边） -->
                    <el-icon v-if="message.from === 'server'" class="avatar server-avatar">
                        <ChatDotRound />
                    </el-icon>
                </div>
            </div>
        </el-main>

        <!-- 底部输入框 -->
        <el-footer style="margin-left: auto; margin-right: auto; height: 15vh;">
            <el-card class="input-card">
                <div class="footer">
                    <el-input v-model="inputMessage" placeholder="请输入内容" class="chat-input" :rows="2" type="textarea"
                        @keyup.enter="sendMessage" />
                    <el-button type="primary" @click="sendMessage" class="send-button">发送</el-button>
                </div>
            </el-card>
        </el-footer>
    </el-container>
</template>

<script setup lang="ts" name="ChatPage">
import { ref, onMounted } from "vue";
import { useUserStore } from '@/stores/user'
import * as ChatApi from '@/api/chatApi'
import { ElMessage } from 'element-plus';
import { User, ChatDotRound } from '@element-plus/icons-vue';  // 引入图标

const typingSpeed = 50
const inputMessage = ref("");
const useUser = useUserStore()
interface MessageForm { text: string, from: 'user' | 'server' }
const displayMessages = ref<MessageForm[]>([])

const sendMessage = async () => {
    if (inputMessage.value.trim() === '') {
        return;
    }
    //获取chatId
    if (useUser.chatId === "" || useUser.chatId === undefined || useUser.chatId === null) {
        //todo 如果没有就先检测登录
        //创建chatId
        const id = await createChatId()
        // displayMessages.value.push({ text: '获取chatId:' + id, from: 'server' })
        await typeMessage('获取chatId:' + id, 'server');
        displayMessages.value.push({ text: inputMessage.value, from: 'user' });
    } else {
        // await typeMessage('已有chatId:' + useUser.chatId, 'server')
        console.log('已有chatId:' + useUser.chatId, 'server')
        displayMessages.value.push({ text: inputMessage.value, from: 'user' });
        //根据已有的chatId获取对话结果
    }
    // 这里可以加入消息发送的逻辑
    // typeMessage(inputMessage.value, 'user');
    inputMessage.value = ""; // 清空输入框
};
const createChatId = async () => {
    const res = await ChatApi.getChatId({
        userID: "111111"
    })
    const { data } = res.data
    useUser.chatId = data
    return String(useUser.chatId)
}
// 根据消息发送方返回不同的样式类
const getMessageClass = (message: { text: string, from: 'user' | 'server' }) => {
    return message.from === 'user' ? 'message user-message' : 'message server-message';
};
// 逐字显示消息的函数
const typeMessage = (message: string, from: 'user' | 'server') => {
    return new Promise<void>((resolve) => {
        let displayedMessage = '';  // 用来拼接显示的局部变量
        let index = 0;

        // 在显示逐字消息前，先将一条空消息插入数组
        displayMessages.value.push({ text: '', from });

        const interval = setInterval(() => {
            if (index < message.length) {
                displayedMessage += message[index];

                // 在每次拼接时，修改数组中最后一条消息的 text 字段，不会覆盖整个数组
                displayMessages.value[displayMessages.value.length - 1].text = displayedMessage;
                index++;
            } else {
                clearInterval(interval);  // 消息显示完毕时清除定时器
                resolve();  // 定时器完成后，执行 resolve，通知 Promise 完成
            }
        }, typingSpeed);
    });
};

onMounted(() => {
    //获取问候语，并打印
    const firstChatText = "你好，欢迎来到WinterAI \uD83C\uDF89\n" +
        "很高兴与你交流任何话题，欢迎随时来找我！"
    // displayMessages.value.push({ text: firstChatText, from: 'server' })
    typeMessage(firstChatText, 'server')
});
// background-color: #f5f5f5;
</script>

<style scoped>
/* 头像样式 */
.avatar {
    width: 40px;
    height: 40px;
}

/* 用户头像显示在左边 */
.user-avatar {
    order: 3;
    margin-left: 10px;
    font-size: 40px;
}

/* 服务器头像显示在右边 */
.server-avatar {
    order: 1;
    margin-right: 10px;
    font-size: 40px;

}

/* 消息内容的样式 */
.message {
    max-width: 70%;
    padding: 10px;
    border-radius: 10px;
    word-wrap: break-word;
}

/* 用户消息，靠右对齐 */
.user-message {
    background-color: #409eff;
    color: white;
    margin-left: auto;
    order: 2;
}

/* 服务器消息，靠左对齐 */
.server-message {
    background-color: #f0f0f0;
    align-self: flex-start;
    order: 2;
}

.footer {
    display: flex;
    gap: 10px;
    align-items: center;
}

.chat-input {
    flex: 1;
    margin-right: 10px;
}

.input-card {
    border-radius: 20px;
    width: 60vw;
}

:deep(.el-textarea__inner) {
    box-shadow: none;
    resize: none;
}

/* 消息容器 */
.message-wrapper {
    display: flex;
    align-items: flex-start;
    margin-bottom: 10px;
}

.chat-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    max-height: 100vh;
    padding: 20px;
}

.message-container {
    flex-grow: 1;
    overflow-y: auto;
    margin-bottom: 10px;
    padding-right: 10px;
}

p {
    font-family: 'Courier New', Courier, monospace;
    /* 模拟打字机效果的字体 */
    white-space: pre-wrap;
    /* 保证换行符等特殊字符显示 */
}
</style>