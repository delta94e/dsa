import Foundation

enum AppTab: String, CaseIterable {
    case chats = "Chats"
    case stories = "Stories"
    case notifications = "Notifications"
    case menu = "Menu"
    
    var icon: String {
        switch self {
        case .chats: return "message.fill"
        case .stories: return "circle.circle"
        case .notifications: return "bell.fill"
        case .menu: return "line.3.horizontal"
        }
    }
    
    var badgeCount: Int? {
        switch self {
        case .chats: return 3
        case .stories: return nil
        case .notifications: return nil
        case .menu: return nil
        }
    }
}
