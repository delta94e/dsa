/**
 * Definition for a binary tree node.
 * class TreeNode {
 *     constructor(val = 0, left = null, right = null) {
 *         this.val = val;
 *         this.left = left;
 *         this.right = right;
 *     }
 * }
 */

class Solution {
    /**
     * @param {TreeNode} root
     * @return {number}
     */
    diameterOfBinaryTree(root) {
       let stack = [root];
       let mp = new Map();
       mp.set(null, [0, 0])

       while(stack.length> 0) {
        let node = stack[stack.lengh - 1]

        if(node.left && !mp.has(node.left)) {
            stack.push(node.left)
        } else if(node.right && !mp.has(node.right)) {
            stack.push(node.right)   
        } else {
            node = stack.pop();

            let [leftHeight, leftDiameter] = mp.get(node.left);
            let [rightHeight, rightDiameter] = mp.get(node.right);

            let height = 1 + Math.max(leftHeight, rightHeight)
            let diameter = Math.max(leftHeight + rightHeight, Math.max(leftDiameter, rightDiameter))

            mp.set(node, [height, diameter])
        }

        return mp.get(root)[1]
       }
    }
}