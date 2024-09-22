import request from '@/utils/request';
export const getChatId = async (params: any) => {
    return await request({
        url: '/system/chat/create',
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
        .then(stream => {
            if (!stream) {
                throw new Error('No stream found');
            }
            const reader = stream.getReader();
            const transformer = new TransformStream();
            const writer = transformer.writable.getWriter();

            function readChunk() {
                reader.read().then(({ value, done }) => {
                    if (done) {
                        // 数据流结束
                        console.log('Done reading the stream');
                        return;
                    }
                    // 将 Uint8Array 转换为字符串
                    const text = new TextDecoder().decode(value);
                    console.log('Received chunk:', text);
                    if (text.trim() != "") {
                        const ans = JSON.parse(text).answer
                        if (ans != null || ans != "") {
                            dealMsg(text);
                        }
                    }
                    // writer.write(text); // 写入转换后的数据
                    setTimeout(readChunk, 1000); // 延时1秒后继续读取下一个数据块
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