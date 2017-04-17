/**
 * 可视化
 * - 耗时对比
 * - 节点数
 * - 节点深度分布
 */
import { timingReact, timingFastReact } from './lib/timing';

import Ke from './components/Ke';

var components = [Ke];

/**
 * 获取要进行 benchmark 的组件索引
 */
function getSelectedComponent() {
    var ret = [];
    document.forms.components.component.forEach(function(input){
        if(input.checked) {
            ret.push(input.value);
        }
    });
    return ret;
}

function init() {
    let btn = document.querySelector('#run');
    btn && btn.addEventListener('click', function() {
        // #1 耗时
        let A1 = [];
        let B1 = [];
        // #2 节点数
        // #3 节点分布
        let arr = getSelectedComponent();
        arr.forEach(index => {
            let component = components[index];

            let a = timingReact(component);
            A1.push(a.time);

            let b = timingFastReact(component);
            B1.push(b.time);
        });
        console.log(A1, B1);
    });
}

init();
