import request from '@/utils/request';
export const getChatId = async (params: any) => {
    return await request({
        url: '/chat/create',
        method: 'post',
        data: params
    })
}
export const getChatMsg = async (params: any, dealMsg: (chunk: string) => void) => {
    return await getChatMsgStream("/system/chat/question", params, dealMsg)
}
const getChatMsgStream = async (url: string, param: any, dealMsg: (chunk: string) => void) => {
    await fetch(url, {
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
                        console.log('Done reading the stream');
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
                                    dealMsg(parsed.answer);  // 处理答案
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

// 创建一个SSE连接，并返回一个关闭连接的函数，请求方式为GET
const createSSEWithGet = (onMessageCallback: (msg: string) => void) => {
    const eventSource = new EventSource('/api/chat/sse');

    eventSource.onmessage = (event) => {
        // 调用传入的回调方法处理消息
        if (typeof onMessageCallback === 'function') {
            onMessageCallback(event.data);
        }
    };

    eventSource.onerror = (error) => {
        console.error('SSE connection error:', error);
        eventSource.close();
    };

    // 返回一个函数用于关闭SSE连接
    return () => {
        eventSource.close();
    };
};
const createSSEWithPost = (params: any, onMessageCallback: (msg: string) => void) => {

}