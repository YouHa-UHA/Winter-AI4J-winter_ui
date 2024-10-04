<template>
    <div class="container">
        <div style="margin: 30vh auto;">
            <div class="message title-message">
                <Faulttext ref="faultRef" :content="titleContent" :ifFault="true" />
            </div>

            <el-card class="input-card">
                <div class="footer">
                    <el-input v-if="ifSendMsg" v-model="inputMessage" type="textarea" :row="2"
                        placeholder="Please input Message" class="chat-input" @keyup.enter="sendMessage" />
                    <el-input v-if="!ifSendMsg" v-model="phoneNum" placeholder="Please input phone" class="chat-input"
                        @keyup.enter="sendLogin">
                        <template #prepend>
                            phone
                        </template>
                    </el-input>
                    <el-input v-if="!ifSendMsg" v-model="passwd" placeholder="Please input password" class="chat-input"
                        type="password" @keyup.enter="sendLogin" show-password>
                        <template #prepend>
                            password
                        </template>
                    </el-input>

                    <el-button type="primary" @click="sendSubmit" class="send-button">发送</el-button>
                </div>
                <template #footer>
                    <el-button type="warning" plain>功能1</el-button>
                    <el-button type="success" plain>功能2</el-button>
                </template>
            </el-card>
        </div>
    </div>
</template>
<script setup lang="ts" name="ChatLogin">
import { ref, onMounted } from "vue";
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import * as ChatApi from '@/api/chatApi'
import { ElMessage } from 'element-plus';
import Faulttext from '../components/Faulttext.vue';

const ifSendMsg = ref(false)
const faultRef = ref()
const useUser = useUserStore()
const inputMessage = ref("");
const passwd = ref("123456");
const phoneNum = ref("18335083606");
const titleList = ['登录超时！请重新登录', '登录失败！用户名或密码错误', '欢迎使用WinterAI！今天从哪里开始呢？']
const titleContent = ref(titleList[0])
const router = useRouter()

const sendLogin = async () => {
    const { data } = await ChatApi.userLogin({ phone: phoneNum.value, password: passwd.value })
    console.log(data)
    if (data.code == 200) {
        // 登录成功
        ifSendMsg.value = true
        titleContent.value = titleList[2]
        faultRef.value.typeMessage(titleContent.value)
        // 获取token信息，存储到pinia
        useUser.token = data.tokenValue
        useUser.loginId = data.loginId
    } else {
        // 登录失败
        ifSendMsg.value = false
        titleContent.value = titleList[1]
    }
};

const sendMessage = async () => {
    //获取对话信息，存储到pinia

    if (!useUser.chatId) {
        try {
            const id = await createChatId();
            if (!id || id === 'null') {
                ElMessage.error('无法获取chatId，请稍后重试！');
                return;
            }
            useUser.chatId = id; // 保存获取到的 chatId
            useUser.chat1stMsg = inputMessage.value
            router.push({ path: '/', query: { chatTitle: inputMessage.value.substring(0, 5) } })
        } catch (error) {
            ElMessage.error('获取chatId失败，请稍后重试！');
            console.error('获取 chatId 错误:', error);
            return;
        }
    }
}
const createChatId = async () => {
    const res = await ChatApi.getChatId({
        userID: "111111"
    })
    const { data } = res.data
    useUser.chatId = data
    return String(useUser.chatId)
}
const sendSubmit = async () => {
    if (ifSendMsg.value) {
        await sendMessage()
    } else {
        await sendLogin()
    }
}
onMounted(() => {
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
    display: flex;
    justify-content: center;
    height: 50px;
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
</style>