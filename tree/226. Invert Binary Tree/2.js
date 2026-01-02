/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {TreeNode}
 */
var invertTree = function(root) {
    if(root === null) return null;

    let queue = [root];

    while(queue.length > 0) {
        let node = queue.shift();
        [node.left, node.right] = [node.right, node.left];
        if(node.left) queue.push(node.left);
        if(node.right) queue.push(node.right);
    }

    return root
};