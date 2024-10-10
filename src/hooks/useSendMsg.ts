import { ref } from 'vue';
import * as chatApi from '../api/chatApi';
interface GptMsg {
    role: 'user' | 'server';
    content: string;
}

interface QuestionInf {
    chatId: string;
    appIndex: string;
    question: string;
}

class StreamMsg {
    private onStart: (prompt: string) => void;
    private onDone: (param: QuestionInf) => void;
    private onPatch: (text: string) => void;
    private abortController: AbortController | null = null;

    constructor(options: {
        onStart: (prompt: string) => void,
        onDone: (param: QuestionInf) => void,
        onPatch: (text: string) => void
    }) {
        this.onStart = options.onStart;
        this.onPatch = options.onPatch;
        this.onDone = options.onDone;
    }

    // 提供中止流的方法
    abortStream() {
        if (this.abortController) {
            this.abortController.abort();
            console.log('用户已中止流');
        }
    }

    getChatMsgStream(param: QuestionInf, streaming = false) {
        this.onStart(param.question);
        this.abortController = new AbortController();

        fetch('/winter/chat/question', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(param),
            signal: this.abortController.signal
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('网络响应错误');
                }
                return response.body;
            })
            .then(stream => {
                if (!stream) {
                    throw new Error('未找到流');
                }
                const reader = stream.getReader();

                const readChunk = () => {
                    reader.read().then(({ value, done }) => {
                        if (done) {
                            this.onDone(param);
                            console.log('流读取完毕');
                            return;
                        }

                        const textList = new TextDecoder().decode(value).split('data:').filter(chunk => chunk.trim() !== "");

                        textList.forEach(text => {
                            const cleanedText = text.trim();

                            if (cleanedText) {
                                try {
                                    const parsed = JSON.parse(cleanedText);

                                    if (parsed && parsed.answer != null && parsed.answer !== "") {
                                        this.onPatch(parsed.answer);
                                    }
                                } catch (error) {
                                    console.error('JSON解析失败:', cleanedText, error);
                                }
                            } else {
                                console.log('接收到空或无效数据块');
                            }
                        });

                        setTimeout(readChunk, 30);
                    }).catch(error => {
                        if (error.name === 'AbortError') {
                            console.log('流读取被中止');
                        } else {
                            console.error('读取流时出错:', error);
                        }
                    });
                };
                readChunk();
            })
            .catch(error => {
                if (error.name === 'AbortError') {
                    console.log('请求被中止');
                } else {
                    console.error('错误:', error);
                }
            });
    }
}



export const useSendMsg = () => {
    const streamingText = ref('');
    const streaming = ref(false);
    const follow = ref<string[]>()
    const msgList = ref<GptMsg[]>([]);
    const gpt = new StreamMsg({
        onStart: (prompt: string) => {
            streaming.value = true;
            msgList.value.push({
                role: 'user',
                content: prompt
            });
        },
        onDone: async (param: QuestionInf) => {
            streaming.value = false;
            msgList.value.push({
                role: 'server',
                content: streamingText.value
            });
            streamingText.value = '';
            //发送联想请求
            const { data } = await chatApi.getFollow(param)
            follow.value = data.follow
        },
        onPatch: (text: string) => {
            streamingText.value += text;
        }
    });

    const stream = (prompt: QuestionInf) => {
        gpt.getChatMsgStream(prompt);
    };

    const abortStream = () => {
        streaming.value = false;
        msgList.value.push({
            role: 'server',
            content: streamingText.value
        });
        streamingText.value = '';
        gpt.abortStream();
    };

    return {
        streamingText,
        streaming,
        msgList,
        stream,
        abortStream,
        follow
    };
};
