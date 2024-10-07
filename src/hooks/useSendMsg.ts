import { ref } from 'vue'
import { StreamMsg, type QuestionInf } from '../scripts'
interface GptMsg {
    role: string
    content: string
}
export const useSendMsg = () => {
    const streamingText = ref('')
    const streaming = ref(false)
    const msgList = ref<GptMsg[]>([])
    const gpt = new StreamMsg({
        onStart: (prompt: string) => {
            streaming.value = true
            msgList.value.push({
                role: 'user',
                content: prompt
            })
        },
        onDone: () => {
            streaming.value = false
            msgList.value.push({
                role: 'server',
                content: streamingText.value
            })
            streamingText.value = ''
        },
        onPatch: (text: string) => {
            streamingText.value += text
            // typeMessage(streamingText.value)
        }
    })
    const stream = (prompt: QuestionInf) => {
        gpt.getChatMsgStream(prompt)
    }
    // 逐字显示消息的函数
    const typeMessage = (message: string) => {
        return new Promise<void>((resolve) => {
            let displayedMessage = '';  // 用来拼接显示的局部变量
            let index = 0;

            const interval = setInterval(() => {
                if (index < message.length) {
                    displayedMessage += message[index];

                    // 在每次拼接时，修改数组中最后一条消息的 text 字段，不会覆盖整个数组
                    // onSubmit()
                    index++;
                } else {
                    clearInterval(interval);  // 消息显示完毕时清除定时器
                    resolve();  // 定时器完成后，执行 resolve，通知 Promise 完成
                }
            }, 30);
        });
    };

    return {
        streamingText,
        streaming,
        msgList,
        stream
    }
}
