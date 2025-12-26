import SwiftUI

struct ChatRowView: View {
    let chat: Chat
    
    var body: some View {
        HStack(spacing: 12) {
            // Avatar
            ZStack(alignment: .bottomTrailing) {
                // Main avatar
                ZStack {
                    Circle()
                        .fill(
                            LinearGradient(
                                colors: [.blue.opacity(0.4), .purple.opacity(0.4)],
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            )
                        )
                        .frame(width: AppConstants.avatarSize, height: AppConstants.avatarSize)
                    
                    Image(systemName: chat.avatarUrl)
                        .font(.system(size: 24))
                        .foregroundColor(.white)
                }
                
                // Secondary avatar for group chats
                if let _ = chat.secondaryAvatarUrl {
                    ZStack {
                        Circle()
                            .fill(Color.orange.opacity(0.5))
                            .frame(width: AppConstants.smallAvatarSize, height: AppConstants.smallAvatarSize)
                        
                        Image(systemName: "person.fill")
                            .font(.system(size: 14))
                            .foregroundColor(.white)
                    }
                    .offset(x: 4, y: 4)
                }
                
                // Online indicator
                if chat.isActive {
                    Circle()
                        .fill(Color.green)
                        .frame(width: 14, height: 14)
                        .overlay(
                            Circle()
                                .stroke(Color.white, lineWidth: 2)
                        )
                        .offset(x: 2, y: 2)
                }
            }
            
            // Content
            VStack(alignment: .leading, spacing: 4) {
                Text(chat.name)
                    .font(.system(size: 16, weight: chat.hasUnread ? .semibold : .regular))
                    .foregroundColor(.primary)
                    .lineLimit(1)
                
                HStack(spacing: 4) {
                    Text(chat.lastMessage)
                        .font(.system(size: 14))
                        .foregroundColor(chat.hasUnread ? .primary : .lightGray)
                        .fontWeight(chat.hasUnread ? .medium : .regular)
                        .lineLimit(1)
                    
                    if !chat.time.isEmpty {
                        Text("·")
                            .foregroundColor(.lightGray)
                        
                        Text(chat.time)
                            .font(.system(size: 14))
                            .foregroundColor(.lightGray)
                    }
                }
            }
            
            Spacer()
            
            // Unread indicator
            if chat.hasUnread {
                Circle()
                    .fill(Color.messengerBlue)
                    .frame(width: 12, height: 12)
            }
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 8)
    }
}

#Preview {
    VStack {
        ChatRowView(chat: Chat.sampleChats[0])
        ChatRowView(chat: Chat.sampleChats[1])
        ChatRowView(chat: Chat.sampleChats[5])
    }
}
