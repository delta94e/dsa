import SwiftUI

struct ContentView: View {
    @State private var selectedTab: AppTab = .chats
    @State private var isSearchActive = false
    @Namespace private var searchAnimation
    
    var body: some View {
        ZStack {
            // Main content - always rendered but opacity controlled
            VStack(spacing: 0) {
                // Header
                HeaderView()
                    .opacity(isSearchActive ? 0 : 1)
                
                // Search bar (tappable)
                if !isSearchActive {
                    SearchBarView(onTap: {
                        withAnimation(.easeOut(duration: 0.18)) {
                            isSearchActive = true
                        }
                    })
                    .padding(.vertical, 8)
                }
                
                // Main content based on selected tab
                Group {
                    switch selectedTab {
                    case .chats:
                        ChatsView(chats: Chat.sampleChats, stories: Story.sampleStories)
                    case .stories:
                        Spacer()
                        Text("Stories")
                            .font(.title)
                            .foregroundColor(.lightGray)
                        Spacer()
                    case .notifications:
                        Spacer()
                        Text("Notifications")
                            .font(.title)
                            .foregroundColor(.lightGray)
                        Spacer()
                    case .menu:
                        Spacer()
                        Text("Menu")
                            .font(.title)
                            .foregroundColor(.lightGray)
                        Spacer()
                    }
                    
                    // Tab bar
                    TabBarView(selectedTab: $selectedTab)
                }
                .opacity(isSearchActive ? 0 : 1)
            }
            .background(Color.white)
            
            // Search view - always in hierarchy, controlled by opacity and offset
            SearchView(isPresented: $isSearchActive, searchAnimation: searchAnimation)
                .opacity(isSearchActive ? 1 : 0)
                .allowsHitTesting(isSearchActive)
        }
    }
}

#Preview {
    ContentView()
}
