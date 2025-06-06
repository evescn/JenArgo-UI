// action操作的动作 res操作的资源 fn具体操作的方法
import { Modal } from '@arco-design/web-vue'
import { createVNode } from 'vue'

// 颜色映射
const actionColors = {
    删除: 'red',
    编辑: 'blue',
    创建: 'green',
    重启: 'red',
    关闭: 'blue'
}

export function showConfirm(action: any, res: any, fn: any) {
    Modal.confirm({
        // title: '是否继续 ' + action + ' 操作？操作对象：',
        title: createVNode('div', {}, [
            '是否继续 ',
            createVNode(
                'span',
                {
                    style: {
                        color: actionColors[action] || 'black',
                        fontWeight: 'bold'
                    }
                },
                action
            ),
            ' 操作？操作对象：'
        ]),
        icon: '',
        content: createVNode('div', { style: { color: actionColors[action] || 'black', fontWeight: 'bold' } }, res),
        cancelText: '取消',
        okText: '确认',
        onOk: () => {
            fn(res)
        }
    })
}
