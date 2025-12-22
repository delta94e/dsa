var isSymmetric = function(root) {

    if (root === null) return true; // Cây rỗng thì hiển nhiên đối xứng

    return isMirror(root.left, root.right); // So sánh 2 nhánh con

};



// Hàm phụ để so sánh tính đối xứng giữa 2 nút t1 và t2

function isMirror(t1, t2) {

    // 1. Base case: Cả hai đều null (đi hết nhánh mà vẫn khớp)

    if (t1 === null && t2 === null) return true;



    // 2. Base case: Một cái null, một cái có giá trị (Lệch cấu trúc)

    if (t1 === null || t2 === null) return false;



    // 3. So sánh giá trị và Đệ quy (Quy luật bạn vừa tìm ra)

    

    // Cả 3 điều kiện phải cùng đúng:

    // - Giá trị t1 bằng t2

    // - Ngoài khớp Ngoài

    // - Trong khớp Trong

    return (t1.val === t2.val) && isMirror(t1.left,t2.right) &&  isMirror(t1.right,t2.left);

}