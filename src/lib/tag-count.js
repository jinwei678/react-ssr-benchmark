const parse5 = require('parse5');

var fragmentTreeNode = parse5.parseFragment(`
<div> 
  <span> 
    <span></span>
    <span>
      <span></span>
      <span></span>
      <span>
        <span></span>
      </span>
    </span>
  </span>
</div>
`);
// console.log(fragmentTreeNode);

const fs = require('fs');
var fragment = fs.readFileSync('source.html').toString();
fragmentTreeNode = parse5.parseFragment(fragment);

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

function printResult() {
    console.log('总节点', totalTag);
    console.log('最大深度', maxDepth);
    console.log('深度分布');
    console.log(JSON.stringify(depthMap, false, 2));
};

tranverse(fragmentTreeNode);

printResult();
