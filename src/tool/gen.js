/**
 * 统计 html 文件信息
 * 节点数
 * 最大深度
 * 节点深度分布
 */
var fs = require('fs');
var jsx = require('jsx-transform');

const parse5 = require('parse5');

// TODO use cli 
var content = fs.readFileSync('../source/ke.html').toString();
var fragmentTreeNode = parse5.parseFragment(content);

var totalTag = -1;
var depthMap = {};
var maxDepth = 0;
function _tranverse(root, depth) {
    if(root.nodeName == '#text') {
        return;
    }
    if(root.nodeName) {
        totalTag += 1;
    }
    if(depth > 0) {
        if(depthMap[depth]) {
            depthMap[depth] += 1;
        } else {
            depthMap[depth] = 1;
        }
        if(depth > maxDepth) {
            maxDepth = depth;
        }
    }
    if(root.childNodes.length) {
        root.childNodes.forEach(function(child) {
            _tranverse(child, depth+1);
        });
    }
}

function tranverse(root) {
    _tranverse(root, 0);
}

// 遍历节点，生成节点信息
tranverse(fragmentTreeNode);

var A = jsx.fromString(content, {
    factory: "React.createElement"
});

var B = jsx.fromString(content, {
    factory: "FastReact.createElement"
});

var info = JSON.stringify({
    count: totalTag,
    maxDepth: maxDepth,
    depthMap: depthMap
});

fs.writeFileSync("../components/Ke.js", ["var React = require('react')", "var FastReact = require('fast-react-server')",'var A=' + A, 'var B=' + B, 'exports.A = A;exports.B = B', 'exports.info='+info].join(';'));

