// 1. Định nghĩa cấu trúc 1 cái Nút (Node)
function TreeNode(val) {
    this.val = val;
    this.left = null;
    this.right = null;
}

// 2. Hàm chuyển Array -> Tree Object (Phần bạn cần)
function buildTree(arr) {
    if (!arr || arr.length === 0) return null;

    // Tạo nút gốc đầu tiên
    let root = new TreeNode(arr[0]);
    
    // Hàng đợi để nhớ xem đang đến lượt nút nào được "phát" con
    let queue = [root]; 
    
    let i = 1; // Bắt đầu đọc từ phần tử thứ 2 trong mảng

    while (i < arr.length) {
        // Lấy nút cha đang đứng đầu hàng ra
        let current = queue.shift();

        // --- Xử lý Con Trái ---
        if (i < arr.length && arr[i] !== null) {
            current.left = new TreeNode(arr[i]); // Tạo nút
            queue.push(current.left);            // Đẩy vào hàng đợi để chờ đến lượt làm cha
        }
        i++; // Chuyển sang số tiếp theo trong mảng

        // --- Xử lý Con Phải ---
        if (i < arr.length && arr[i] !== null) {
            current.right = new TreeNode(arr[i]); // Tạo nút
            queue.push(current.right);            // Đẩy vào hàng đợi
        }
        i++; // Chuyển sang số tiếp theo
    }

    return root; // Trả về cái nút gốc (đã dính chùm cả dây mơ rễ má bên dưới)
}

// ---------------------------------------------------------
// TEST THỬ NGAY
// Input của bạn:
let inputArr = [1, 2, 3, 4, 5, null, 8, null, null, 6, 7, 9];

// Bước A: Biến mảng thành Object Cây
let myTree = buildTree(inputArr);

console.log("Cấu trúc cây sau khi build:");
console.log(myTree); 
// Bạn sẽ thấy nó in ra object lồng nhau: {val: 1, left: {...}, right: {...}}

// Bước B: Chạy hàm Inorder Traversal (Code cũ của bạn)
var inorderTraversal = function(root) {
    let res = [];
    let stack = [];
    let current = root;
    while (current || stack.length > 0) {
        while (current) {
            stack.push(current);
            current = current.left;
        }
        current = stack.pop();
        res.push(current.val);
        current = current.right;
    }
    return res;
};





// Kết quả cuối cùng
console.log("Kết quả duyệt Inorder:", inorderTraversal(myTree));