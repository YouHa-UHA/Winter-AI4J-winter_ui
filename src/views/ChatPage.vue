<template>
    <el-container class="container">
        <!-- 顶部标题和菜单 -->
        <el-header>
            <div class="header">
                <el-dropdown class="dropdown-menu">
                    <span>
                        {{ chatTitle }}
                        <el-icon class="el-icon--right">
                            <arrow-down />
                        </el-icon>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item><el-icon>
                                    <Edit />
                                </el-icon>修改名称</el-dropdown-item>
                            <el-dropdown-item><el-icon>
                                    <Share />
                                </el-icon>分享对话</el-dropdown-item>
                            <el-dropdown-item><el-icon>
                                    <Delete />
                                </el-icon>删除对话</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
        </el-header>

        <!-- 中间聊天内容 -->
        <el-main class="chat-container">
            <div class="message-container" ref="scrollFromRef">
                <Msg v-for="(msg, index) in msgList" :role="msg.role" :content="msg.content" :key="index"></Msg>
                <Msg v-if="streaming" role="server" :content="streamingText" :streaming="true"></Msg>
            </div>
        </el-main>

        <!-- 底部输入框 -->
        <el-footer style="margin-left: auto; margin-right: auto; height: 15vh;">
            <el-card class="input-card">
                <div class="footer">
                    <el-input v-model="inputMessage" placeholder="请输入内容" class="chat-input" :rows="2" type="textarea"
                        @keyup.enter="sendMessage" />
                    <el-button type="primary" :icon="streaming ? VideoPause : CircleCheck" @click="sendMessage"
                        class="send-button"></el-button>
                </div>
            </el-card>
        </el-footer>
    </el-container>
</template>

<script setup lang="ts" name="ChatPage">
import { ref, onMounted, nextTick, watchEffect } from "vue";
import Msg from '../components/Msg.vue'
import { useUserStore } from '@/stores/user'
import * as ChatApi from '@/api/chatApi'
import { ElMessage } from 'element-plus';
import { Edit, Share, Delete, ArrowDown, VideoPause, CircleCheck } from '@element-plus/icons-vue';  // 引入图标
import { useRouter, useRoute } from "vue-router";
import { useSendMsg } from "@/hooks/useSendMsg";
import { useScroll } from '@vueuse/core'

const { msgList, streaming, streamingText, stream, abortStream } = useSendMsg()
const chatTitle = ref('新对话')
const router = useRouter()
const route = useRoute()
const inputMessage = ref("");
const useUser = useUserStore()
const scrollFromRef = ref()
const { y } = useScroll(scrollFromRef)


const scrollToBottom = () => {
    nextTick(() => {
        y.value = scrollFromRef.value?.scrollHeight || 0
    })
}
watchEffect(() => {
    if (streamingText.value || msgList.value.length > 0) {
        scrollToBottom();
    }
});
const sendMessage = async () => {
    // 判断是否正在对话
    if (streaming.value) {
        console.log('取消')
        abortStream()
        return
    }
    // 检查输入是否为空
    const message = inputMessage.value.trim();
    if (message === '') {
        return;
    }


    // 检查登录
    // router.push({ path: '/login' })
    // return

    inputMessage.value = ''; // 清空输入框
    // 检查并获取 chatId
    if (!useUser.chatId) {
        try {
            const id = await createChatId();
            if (!id || id === 'null') {
                ElMessage.error('无法获取chatId，请稍后重试！');
                return;
            }
            useUser.chatId = id; // 保存获取到的 chatId
        } catch (error) {
            ElMessage.error('获取chatId失败，请稍后重试！');
            console.error('获取 chatId 错误:', error);
            return;
        }
    }

    // 根据已有 chatId 获取对话结果
    // todo 上个问题打印完之后才能输入下个问题
    try {
        stream({ chatId: useUser.chatId, appIndex: "ai_coze", question: message })
    } catch (error) {
        ElMessage.error('发送消息失败，请稍后重试！');
        console.error('发送消息错误:', error);
    }
};


const createChatId = async () => {
    const res = await ChatApi.getChatId({
        userID: "111111"
    })
    const { data } = res.data
    useUser.chatId = data
    return String(useUser.chatId)
}


onMounted(() => {
    chatTitle.value = route.query.chatTitle as string
    //获取问候语，并打印
    const firstChatText = "你好，欢迎来到WinterAI \uD83C\uDF89\n" +
        "很高兴与你交流任何话题，欢迎随时来找我！"
    // displayMessages.value.push({ text: firstChatText, from: 'server' })
    // typeMessage(firstChatText, 'server')
    msgList.value.push({ role: 'server', content: firstChatText })
    inputMessage.value = useUser.chat1stMsg
    sendMessage()
});


</script>

<style scoped>
.dropdown-menu {
    margin: auto
}

.header {
    display: flex;
}

.blulr-border {
    width: 100%;
    height: 10px;
    border-width: 4px;
    filter: blur(5px);
    box-shadow: -15px -15px 46px #fff,
        15px 15px 46px #fff;
}

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
    background-color: var(--server-bg-color);
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
    padding: 0px;
    margin: 0px;
}

.message-container {
    flex-grow: 1;
    overflow-y: auto;
    padding-left: 20vw;
    padding-right: 20vw;
    box-sizing: border-box;
    /* 确保padding包含在元素的宽度内 */
}

.message-container>* {
    max-width: 100%;
    /* 确保子元素不超出容器宽度 */
    word-break: break-word;
    white-space: pre-wrap;
    /* 如果文字过长，强制换行 */
}

p {
    font-family: 'Courier New', Courier, monospace;
    /* 模拟打字机效果的字体 */
    white-space: pre-wrap;
    /* 保证换行符等特殊字符显示 */
}
</style>