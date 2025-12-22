var maxDepth = function(root) {
    if(root === null) return 0;
    let stack = [[root, 1]]
    let res = 0
    while(stack.length > 0) {
        let [node,depth] = stack.pop();

        if(node !== null) {
            res = Math.max(res, depth);
            stack.push([node.left, depth + 1])
            stack.push([node.right, depth + 1])
        }      
    }
    return res
}

// BFS