export interface QuestionInf { chatId: string, appIndex: string, question: string }

export class StreamMsg {
    onStart: (prompt: string) => void
    onDone: () => void
    onPatch: (text: string) => void
    private abortController: AbortController | null = null

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

    // 新增的主动断开连接的方法
    abortStream() {
        if (this.abortController) {
            this.abortController.abort(); // 主动终止连接
            console.log('Stream aborted by user');
        }
    }

    getChatMsgStream(param: QuestionInf, streaming = false) {
        this.onStart(param.question)

        // 创建一个新的AbortController
        this.abortController = new AbortController();

        fetch('/winter/chat/question', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(param),
            signal: this.abortController.signal // 传递 abort 信号
        }).then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.body;
        })
            .then(stream => {
                if (!stream) {
                    throw new Error('No stream found');
                }
                const reader = stream.getReader();

                const readChunk = () => {
                    reader.read().then(({ value, done }) => {
                        if (done) {
                            this.onDone();
                            console.log('Done reading the stream');
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
                                console.log('Received empty or invalid chunk');
                            }
                        });

                        setTimeout(readChunk, 30);
                    }).catch(error => {
                        if (error.name === 'AbortError') {
                            // 捕获到流中止时的异常，不再继续读取
                            console.log('Stream reading aborted');
                        } else {
                            console.error('Error while reading stream:', error);
                        }
                    });
                }
                readChunk();
            })
            .catch(error => {
                if (error.name === 'AbortError') {
                    console.log('Fetch aborted');
                } else {
                    console.error('Error:', error);
                }
            });
    }
}
