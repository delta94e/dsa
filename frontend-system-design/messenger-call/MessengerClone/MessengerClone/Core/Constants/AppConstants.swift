import SwiftUI

// MARK: - Color Extensions
extension Color {
    static let messengerBlue = Color(red: 0, green: 132/255, blue: 255/255)
    static let messengerGradientStart = Color(red: 0, green: 132/255, blue: 255/255)
    static let messengerGradientEnd = Color(red: 148/255, green: 103/255, blue: 255/255)
    static let searchBarBackground = Color(red: 242/255, green: 242/255, blue: 247/255)
    static let lightGray = Color(red: 142/255, green: 142/255, blue: 147/255)
    static let storyBorderActive = LinearGradient(
        colors: [.blue, .purple, .pink],
        startPoint: .topLeading,
        endPoint: .bottomTrailing
    )
}

// MARK: - Constants
struct AppConstants {
    static let avatarSize: CGFloat = 56
    static let storyAvatarSize: CGFloat = 70
    static let smallAvatarSize: CGFloat = 32
    static let cornerRadius: CGFloat = 20
    static let spacing: CGFloat = 12
}
