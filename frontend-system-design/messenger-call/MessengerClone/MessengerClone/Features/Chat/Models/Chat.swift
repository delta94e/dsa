import Foundation

struct Chat: Identifiable {
    let id = UUID()
    let name: String
    let lastMessage: String
    let time: String
    let avatarUrl: String
    let hasUnread: Bool
    let isActive: Bool
    let secondaryAvatarUrl: String?
    
    init(name: String, lastMessage: String, time: String, avatarUrl: String, hasUnread: Bool = false, isActive: Bool = false, secondaryAvatarUrl: String? = nil) {
        self.name = name
        self.lastMessage = lastMessage
        self.time = time
        self.avatarUrl = avatarUrl
        self.hasUnread = hasUnread
        self.isActive = isActive
        self.secondaryAvatarUrl = secondaryAvatarUrl
    }
}

// Sample data
extension Chat {
    static let sampleChats: [Chat] = [
        Chat(name: "Chợ mua bán trao đổi Mô Hình...", lastMessage: "2 unread chats", time: "12:21 am", avatarUrl: "person.3.fill", hasUnread: true),
        Chat(name: "Hội Chủ Mới BT 🧹", lastMessage: "9+ new mess...", time: "11:08 pm", avatarUrl: "person.2.fill", hasUnread: true, secondaryAvatarUrl: "person.crop.circle.fill"),
        Chat(name: "Bé quậy ❤️ 🐶", lastMessage: "You sent an attachment.", time: "9:49 pm", avatarUrl: "heart.fill", hasUnread: false),
        Chat(name: "Đạt, Nguyễn", lastMessage: "Đạt: mấy anh trai á :))", time: "4:54 pm", avatarUrl: "person.circle.fill", hasUnread: false),
        Chat(name: "Mỗi ngày 1 từ vựng IEL...", lastMessage: "30 ngày chinh p...", time: "11:09 am", avatarUrl: "book.fill", hasUnread: true, secondaryAvatarUrl: "calendar"),
        Chat(name: "Mẫn Nguyễn", lastMessage: "You: cảm ơn ba", time: "10:56 am", avatarUrl: "person.crop.circle", hasUnread: false, isActive: true),
        Chat(name: "Truc Mai Le", lastMessage: "", time: "", avatarUrl: "person.crop.circle.fill", hasUnread: false, isActive: true)
    ]
}
