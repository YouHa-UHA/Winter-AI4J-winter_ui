<template>
    <div class="msg-item" :class="{ 'msg-item-system': role === 'server' }">
        <div class="msg-content">
            <el-icon v-if="role === 'server'" class="msg-server-avatar">
                <ChatDotRound />
            </el-icon>
            <span class="msg-pop-container">
                <div class="msg-pop-default" :class="{ 'msg-pop-primary': role === 'user' }">
                    <span v-html="mkHtml" ref="popRef">
                    </span>
                    <!-- 复制按钮 -->
                    <br />
                    <el-tooltip content="Copy" placement="top">
                        <el-button class="footer-button" link :icon="CopyDocument" @click="copyText" circle></el-button>
                    </el-tooltip>
                </div>
            </span>
            <el-icon v-if="role === 'user'" class="msg-user-avatar">
                <User />
            </el-icon>
        </div>
    </div>
</template>
<script setup lang="ts" name="Msg">
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-dark-reasonable.css'
import { computed, nextTick, ref } from 'vue'
import { User, ChatDotRound, CopyDocument } from '@element-plus/icons-vue';  // 引入图标

const copyText = () => {
    const text = popRef.value.innerText
    navigator.clipboard.writeText(text)
}
interface Props {
    role: string
    content: string
    streaming?: boolean
}
const props = withDefaults(defineProps<Props>(), {
    content: '',
    streaming: false
})
const md: MarkdownIt = MarkdownIt({
    highlight: function (str: string, lang: string) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return `<div class="hl-code"><div class="hl-code-header sticky"><span>${lang}</span><button class="copy-btn" @click="copyCode">copy</button></div><div class="hljs"><code>${hljs.highlight(str, { language: lang, ignoreIllegals: true }).value
                    }</code></div></div>`
            } catch (__) {
                console.log(__, 'error')
            }
        }
        return `<div class="hl-code"><div class="hl-code-header"><span>${lang}</span><button class="copy-btn" @click="copyCode">copy</button></div><div class="hljs"><code>${md.utils.escapeHtml(str)}</code></div></div>`
    }
})
// 监听复制按钮点击事件
document.addEventListener('click', function (event) {
    const target = event.target as HTMLElement;
    if (target.classList.contains('copy-btn')) {
        copyCode(event);
    }
});

function copyCode(event: Event) {
    const button = event.target as HTMLElement
    const codeBlock = button.closest('.hl-code')?.querySelector('code')
    const codeText = codeBlock?.innerText
    if (codeText) {
        navigator.clipboard.writeText(codeText).then(() => {
            button.innerText = 'Copied!'
            setTimeout(() => {
                button.innerText = 'Copy'
            }, 2000)
        }).catch(err => {
            console.error('Failed to copy text: ', err)
        })
    }
}
function findLastElement(element: HTMLElement): HTMLElement {
    if (!element.children.length) {
        return element
    }
    const lastChild = element.children[element.children.length - 1]
    if (lastChild.nodeType === Node.ELEMENT_NODE) {
        return findLastElement(lastChild as HTMLElement)
    }
    return element
}
const popRef = ref()
const mkHtml = computed(() => {
    if (props.role === 'user') {
        return props.content
    }
    let html = md.render(props.content)
    nextTick(() => {
        if (props.streaming) {
            const parent = popRef.value
            if (!parent) return
            let lastChild = parent.lastElementChild || parent
            if (lastChild.tagName === 'PRE') {
                lastChild = lastChild.getElementsByClassName('hljs')[0] || lastChild
            }
            if (lastChild.tagName === 'OL') {
                lastChild = findLastElement(lastChild as HTMLElement)
            }
            lastChild?.insertAdjacentHTML('beforeend', '<span class="input-cursor"></span>')
        }
    })
    return html
})

</script>
<style lang="scss" scoped>
.msg-item {
    width: 100%;
    margin-bottom: 10px;
    display: flex;
    justify-content: flex-end; // 用户消息靠右
    align-items: flex-start;

    .msg-user-avatar {
        width: 40px;
        height: 40px;
        margin-left: 10px;
        font-size: 40px;
    }

    .msg-server-avatar {
        width: 40px;
        height: 40px;
        margin-right: 10px;
        font-size: 40px;
    }

    .msg-content {
        max-width: 100%;
        display: flex;
        align-items: flex-start;

        .msg-pop-container {
            display: inline-block;
            max-width: 100%;

            .msg-pop-default {
                max-width: 90%;
                display: inline-block;
                padding: 8px;
                background: var(--server-bg-color);
                border-radius: 4px;
                color: white;

                :deep(p) {
                    margin-bottom: 0;
                    white-space: pre-line;
                }
            }

            .msg-pop-primary {
                background: #409eff;
                color: white;
                margin-left: auto;
            }
        }
    }
}

.msg-item-system {
    justify-content: flex-start; // 系统消息靠左
    align-self: flex-start;
    white-space: pre-wrap;
}

.footer-button {
    color: white;
}
</style>
<style lang="scss">
table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
    background-color: white;
    /* 白色背景 */
    color: black;
    /* 黑色文字 */
}

th,
td {
    border: 1px solid #ddd;
    /* 灰色边框 */
    padding: 12px;
    /* 内边距 */
    text-align: left;
    /* 左对齐 */
}

th {
    background-color: #f6f8fa;
    /* 表头背景颜色 */
    font-weight: bold;
    /* 表头加粗 */
}

tr:nth-child(even) {
    background-color: #f6f8fa;
    /* 偶数行背景颜色 */
}

tr:hover {
    background-color: #f1f1f1;
    /* 悬停时的背景颜色 */
}

.copy-btn {
    background-color: #1d2635;
    color: white;
    border: none;
    padding: 5px 10px;
    cursor: pointer;
    border-radius: 3px;
}

.copy-btn:hover {
    background-color: #717070;
}

.hl-code {
    margin-top: 1em;
}

.hl-code-header {
    padding: 0 10px;
    color: #ddd;
    background: #1d2635;
    border-radius: 4px 4px 0 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

/*copy按钮固钉效果 */
.sticky {
    position: -webkit-sticky;
    /* For Safari */
    position: sticky;
    top: 0;
    z-index: 10;
    /* 确保在滚动时覆盖其他元素 */
    color: white;
    background: #1d2635;
    /* 防止内容滚动时透明 */
    border-bottom: 1px solid #1d2635;
}

.hljs {
    padding: 10px;
    overflow-x: auto;
    border-radius: 0 0 4px 4px;

    .input-cursor {
        background: #fff;
        /* fallback for old browsers */
    }
}

.input-cursor {
    position: relative;
    display: inline-flex;
    align-items: center;
    width: 1em; // 宽度改为与高度相等
    height: 1em; // 维持高度为1em
    background: black; // 设置光标颜色
    padding-left: 0.05em;
    top: 0.1em;
    border-radius: 50%; // 使其为圆形
    animation: blink 1s steps(1) infinite; // 设置闪烁动画
}


@keyframes blink {
    0% {
        visibility: visible;
    }

    50% {
        visibility: hidden;
    }

    100% {
        visibility: visible;
    }
}
</style>