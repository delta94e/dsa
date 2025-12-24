import SwiftUI

struct ChatsView: View {
    let chats: [Chat]
    let stories: [Story]
    
    var body: some View {
        ScrollView {
            VStack(spacing: 0) {
                // Stories section
                StoriesView(stories: stories)
                
                // Divider
                Divider()
                    .padding(.horizontal, 16)
                
                // Chat list
                LazyVStack(spacing: 0) {
                    ForEach(chats) { chat in
                        ChatRowView(chat: chat)
                    }
                }
            }
        }
    }
}

#Preview {
    ChatsView(chats: Chat.sampleChats, stories: Story.sampleStories)
}
