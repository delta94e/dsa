var isBalanced = function(root) {
    if(node === null) return true;

    let res = checkHeight(root)
    return res !== Number.MIN_SAFE_INTEGER
}

function checkHeight(node) {
    if(node === null) return 0;
    let leftHeight = checkHeight(node.left)
    if(leftHeight === Number.MIN_SAFE_INTEGER) return Number.MIN_SAFE_INTEGER
    let rightHeight = checkHeight(node.right)
    if(rightHeight === Number.MIN_SAFE_INTEGER) return Number.MIN_SAFE_INTEGER
    let heightDiff = leftHeight - rightHeight
    if(Math.abs(heightDiff) > 1) return Number.MIN_SAFE_INTEGER
    return Math.max(leftHeight, rightHeight) + 1
}