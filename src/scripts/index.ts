export interface QuestionInf { chatId: string, appIndex: string, question: string }

export class StreamMsg {
    onStart: (prompt: string) => void
    onDone: () => void
    onPatch: (text: string) => void
    constructor(options: {
        onStart: (prompt: string) => void
        onDone: () => void
        onPatch: (text: string) => void
    }) {
        const { onStart, onDone, onPatch } = options
        this.onStart = onStart
        this.onPatch = onPatch
        this.onDone = onDone
    }
    async getChatMsgStream(param: QuestionInf) {
        this.onStart(param.question)
        await fetch('/winter/chat/question', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(param)
        }).then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.body;
        })
            .then(async stream => {
                if (!stream) {
                    throw new Error('No stream found');
                }
                const reader = stream.getReader();
                // const transformer = new TransformStream();
                // const writer = transformer.writable.getWriter();

                const readChunk = () => {
                    reader.read().then(({ value, done }) => {
                        if (done) {
                            // 数据流结束
                            this.onDone()
                            console.log('Done reading the stream');
                            //todo 结束之后，发联想问题请求
                            return;
                        }

                        // 将 Uint8Array 转换为字符串并分割成多个片段
                        const textList = new TextDecoder().decode(value).split('data:').filter(chunk => chunk.trim() !== "");
                        console.log('Received chunk:', textList);

                        // 处理每个分片
                        textList.forEach(text => {
                            const cleanedText = text.trim(); // 预先去除空白字符

                            // 检查清理后的字符串是否非空
                            if (cleanedText) {
                                try {
                                    // 尝试解析 JSON
                                    const parsed = JSON.parse(cleanedText);

                                    // 验证是否包含 answer 字段
                                    if (parsed && parsed.answer != null && parsed.answer !== "") {
                                        // console.log('每个 answer:', parsed.answer);
                                        // dealMsg(parsed.answer);  
                                        this.onPatch(parsed.answer) // 处理答案
                                    }
                                } catch (error) {
                                    console.error('JSON解析失败:', cleanedText, error); // 打印错误信息
                                    // 捕获 JSON 解析错误，继续读取
                                }
                            } else {
                                console.log('Received empty or invalid chunk');
                            }
                        });

                        // 延时后继续读取下一个数据块
                        setTimeout(readChunk, 30);
                    });
                }
                readChunk(); // 启动读取流程
            })
            .catch(error => {
                console.error('Error:', error);
            })
    }
}