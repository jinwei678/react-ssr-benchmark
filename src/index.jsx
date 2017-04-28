/**
 * 可视化
 * - 耗时对比
 * - 节点数
 * - 节点深度分布
 */
import { timingReact, timingFastReact } from './lib/timing';

import Ke from './components/Ke';
import Taobao from './components/Taobao';
import Tmall from './components/Tmall';
import Jd from './components/Jd';
import KeNew from './components/KeNew';

var components = [{
    title: '课堂首页',
    component: Ke,
    id: 'chart01',
}, {
    title: '淘宝首页',
    component: Taobao,
    id: 'chart02',
}, {
    title: '天猫首页',
    component: Tmall,
    id: 'chart03',
}, {
    title: '京东首页',
    component: Jd,
    id: 'chart04',
}, {
    title: '课堂首页New',
    component: KeNew,
    id: 'chart04',
}];

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

/**
 * 渲染 bar chart
 */ 
function renderBarChart(param) {
    var chart = echarts.init(document.getElementById(param.id));
    var option = {
        title: {
            text: param.title
        },
        legend: param.legend || false,
        tooltip: {},
        xAxis: {
            data: param.xaxis
        },
        yAxis: {},
        series: param.series,
    };
    chart.setOption(option);
}

/**
 * 渲染 line chart
 */ 
function renderLineChart(param) {
    var chart = echarts.init(document.getElementById(param.id));
    // 指定图表的配置项和数据
    // 使用刚指定的配置项和数据显示图表。
    chart.setOption(param);
}

/**
 * 文件大小信息
 */
function renderBarSize() {
    var chart = echarts.init(document.getElementById('chart04'));
    let option = {
        title: {
            text: '首屏html尺寸(kb)',
        },
        xAxis: {
            data: ["课堂首页", "淘宝首页", "天猫首页", "京东首页", "课堂新版首页"],
        },
        yAxis: {},
        series: [{
            type: 'bar',
            data: [121.8, 43.5, 20.8, 25.3, 247.3],
        }]
    };
    chart.setOption(option);
}


function init() {
    let btn = document.querySelector('#run');
    btn && btn.addEventListener('click', function() {
        // #1 耗时
        // #2 节点数
        // #3 节点分布

        let A = {
            title: '渲染耗时',
            id: 'chart01',
            xaxis: [],
            legend: {
                data: ['react', 'fast-react']
            },
            series: [{
                name: 'react',
                type: 'bar',
                data: []
            }, {
                name: 'fast-react',
                type: 'bar',
                data: []
            }]
        };

        let B = {
            title: '节点数',
            id: 'chart02',
            xaxis: [],
            series: [{
                type: 'bar',
                data: []
            }]
        };

        let C = {
            id: 'chart03',            
            title: {
                text: '节点深度分布',
            },
            legend: {
                data: [],
            },
            xAxis: {
                type: 'value',
            },
            yAxis: {
                type: 'value',
            },
            series: []
        };

        let arr = getSelectedComponent();
        let flag = true;
        arr.forEach(index => {
            let el = components[index];
            let component = el.component;
            let info = component.info;

            // 热身，取第二次值
            if(flag) {
                flag = false;
                timingReact(component)
            }
            
            let a = timingReact(component);
            let b = timingFastReact(component);
            
            A.xaxis.push(el.title);
            A.series[0].data.push(a.time);
            A.series[1].data.push(b.time);

            B.xaxis.push(el.title);
            B.series[0].data.push(info.count);
            
            let xy = [];

            for(let depth in info.depthMap) {
                let x = parseInt(depth);
                let y = info.depthMap[depth];
                xy.push([x, y]);
            }

            C.legend.data.push(el.title);

            C.series.push({
                name: el.title,
                type: 'line',
                data: xy,
            });

        });
        
        renderBarChart(A);
        renderBarChart(B);
        renderLineChart(C);
        renderBarSize();
    });
}

init();
