var sortedArrayToBST = function(nums) {
    return helper(0, nums)
}

function helper(left, right) {
    if(left === right) return null;
    let mid = Math.floor((left + right) / 2);
    let node = new TreeNode(nums[mid]);
    node.left = helper(left, mid);
    node.right = helper(mid, right);
    return node;
}
