import SwiftUI

struct NewMessageView: View {
    @Binding var isPresented: Bool
    var onCreateAIComplete: ((String, String) -> Void)? = nil
    @State private var toText = ""
    @State private var showDiscoverAIs = false
    @State private var showNewNote = false
    @FocusState private var isToFieldFocused: Bool
    
    let suggestedPeople = [
        "Lê Ru Tơ",
        "Phạm Thanh Trực",
        "Nguyễn Văn A",
        "Trần Thị B"
    ]
    
    var body: some View {
        NavigationStack {
            VStack(spacing: 0) {
                // Header
                HStack {
                    Button("Cancel") {
                        isPresented = false
                    }
                    .font(.system(size: 17))
                    .foregroundColor(.messengerBlue)
                    
                    Spacer()
                    
                    Text("New")
                        .font(.system(size: 17, weight: .semibold))
                    
                    Spacer()
                    
                    // Invisible placeholder for alignment
                    Text("Cancel")
                        .font(.system(size: 17))
                        .foregroundColor(.clear)
                }
                .padding(.horizontal, 16)
                .padding(.vertical, 16)
                .background(Color.white)
                
                // To: field
                HStack {
                    Text("To:")
                        .font(.system(size: 16))
                        .foregroundColor(.gray)
                    
                    TextField("", text: $toText)
                        .font(.system(size: 16))
                        .focused($isToFieldFocused)
                }
                .padding(.horizontal, 16)
                .padding(.vertical, 12)
                .background(Color.white)
                
                Divider()
                
                // Menu options
                ScrollView {
                    VStack(spacing: 0) {
                        Button(action: {
                            showNewNote = true
                        }) {
                            NewMessageMenuItem(
                                icon: "bubble.left.fill",
                                iconColor: .purple,
                                title: "New note"
                            )
                        }
                        .buttonStyle(PlainButtonStyle())
                        
                        NewMessageMenuItem(
                            icon: "person.2.fill",
                            iconColor: .blue,
                            title: "Group chat"
                        )
                        
                        NewMessageMenuItem(
                            icon: "megaphone.fill",
                            iconColor: .orange,
                            title: "Messaging ads"
                        )
                        
                        Button(action: {
                            showDiscoverAIs = true
                        }) {
                            NewMessageMenuItem(
                                icon: "face.smiling.fill",
                                iconColor: .yellow,
                                title: "Chat with AIs"
                            )
                        }
                        .buttonStyle(PlainButtonStyle())
                        
                        // Suggested section
                        HStack {
                            Text("Suggested")
                                .font(.system(size: 14, weight: .medium))
                                .foregroundColor(.gray)
                            Spacer()
                        }
                        .padding(.horizontal, 16)
                        .padding(.top, 20)
                        .padding(.bottom, 10)
                        
                        // Suggested people
                        ForEach(suggestedPeople, id: \.self) { person in
                            SuggestedPersonRow(name: person)
                        }
                    }
                }
                .background(Color.white)
            }
            .background(Color.white)
            .navigationBarHidden(true)
            .onAppear {
                isToFieldFocused = true
            }
            .fullScreenCover(isPresented: $showDiscoverAIs) {
                DiscoverAIsView(
                    isPresented: $showDiscoverAIs,
                    onDismissToHome: {
                        // Dismiss NewMessageView to go back to home
                        var transaction = Transaction()
                        transaction.disablesAnimations = true
                        withTransaction(transaction) {
                            isPresented = false
                        }
                    },
                    onCreateAIComplete: { aiName, welcomeMessage in
                        // Just pass data up, HeaderView handles dismiss
                        onCreateAIComplete?(aiName, welcomeMessage)
                    }
                )
            }
            .fullScreenCover(isPresented: $showNewNote) {
                NewNoteView(isPresented: $showNewNote)
            }
        }
    }
}

struct NewMessageMenuItem: View {
    let icon: String
    let iconColor: Color
    let title: String
    
    var body: some View {
        HStack(spacing: 12) {
            // Icon in circle
            ZStack {
                Circle()
                    .fill(iconColor.opacity(0.15))
                    .frame(width: 40, height: 40)
                
                Image(systemName: icon)
                    .font(.system(size: 18))
                    .foregroundColor(iconColor)
            }
            
            Text(title)
                .font(.system(size: 16))
                .foregroundColor(.primary)
            
            Spacer()
            
            Image(systemName: "chevron.right")
                .font(.system(size: 14))
                .foregroundColor(.gray)
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 10)
    }
}

struct SuggestedPersonRow: View {
    let name: String
    
    var body: some View {
        HStack(spacing: 12) {
            // Avatar
            Circle()
                .fill(
                    LinearGradient(
                        colors: [.blue.opacity(0.3), .purple.opacity(0.3)],
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                    )
                )
                .frame(width: 44, height: 44)
                .overlay(
                    Image(systemName: "person.fill")
                        .foregroundColor(.white.opacity(0.8))
                        .font(.system(size: 20))
                )
            
            Text(name)
                .font(.system(size: 16))
                .foregroundColor(.primary)
            
            Spacer()
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 8)
    }
}

#Preview {
    NewMessageView(isPresented: .constant(true))
}

// MARK: - NewNoteView

/**
 View for creating a new note/status to share.
 */
struct NewNoteView: View {
    
    @Binding var isPresented: Bool
    @State private var thoughtText = ""
    @FocusState private var isTextFieldFocused: Bool
    
    private enum Constants {
        static let horizontalPadding: CGFloat = 16
        static let avatarSize: CGFloat = 100
        static let mediaButtonSize: CGFloat = 44
        static let minTapSize: CGFloat = 44
    }
    
    var body: some View {
        VStack(spacing: 0) {
            headerView
            Spacer()
            thoughtBubble.padding(.bottom, 8)
            userAvatar.padding(.bottom, 16)
            mediaButtons.padding(.bottom, 24)
            friendSuggestions.padding(.bottom, 16)
            privacyText.padding(.bottom, 12)
            Spacer()
        }
        .background(Color.white)
        .onAppear { isTextFieldFocused = true }
    }
    
    private var headerView: some View {
        HStack {
            Button(action: { isPresented = false }) {
                Image(systemName: "xmark")
                    .font(.system(size: 18, weight: .medium))
                    .foregroundColor(.primary)
                    .frame(width: Constants.minTapSize, height: Constants.minTapSize)
                    .contentShape(Rectangle())
            }
            Spacer()
            Text("New note").font(.system(size: 17, weight: .semibold))
            Spacer()
            Button(action: { isPresented = false }) {
                Text("Share")
                    .font(.system(size: 17))
                    .foregroundColor(thoughtText.isEmpty ? .gray : .messengerBlue)
            }
            .disabled(thoughtText.isEmpty)
            .frame(width: 60, height: Constants.minTapSize)
            .contentShape(Rectangle())
        }
        .padding(.horizontal, Constants.horizontalPadding)
        .padding(.top, 16)
    }
    
    private var thoughtBubble: some View {
        VStack(spacing: 4) {
            // Main bubble
            TextField("Share a thought...", text: $thoughtText)
                .font(.system(size: 16))
                .multilineTextAlignment(.center)
                .focused($isTextFieldFocused)
                .padding(.horizontal, 20)
                .padding(.vertical, 12)
                .background(
                    RoundedRectangle(cornerRadius: 20)
                        .fill(Color(.systemGray6))
                )
            
            // Thought bubble circles (curved path)
            ZStack {
                Circle()
                    .fill(Color(.systemGray6))
                    .frame(width: 14, height: 14)
                    .offset(x: 0, y: 0)
                
                Circle()
                    .fill(Color(.systemGray6))
                    .frame(width: 10, height: 10)
                    .offset(x: 8, y: 12)
                
                Circle()
                    .fill(Color(.systemGray6))
                    .frame(width: 6, height: 6)
                    .offset(x: 14, y: 22)
            }
            .frame(height: 30)
        }
        .padding(.horizontal, 60)
    }
    
    private var userAvatar: some View {
        Circle()
            .fill(LinearGradient(colors: [.orange, .yellow], startPoint: .topLeading, endPoint: .bottomTrailing))
            .frame(width: Constants.avatarSize, height: Constants.avatarSize)
            .overlay(
                Image(systemName: "person.fill")
                    .font(.system(size: 40))
                    .foregroundColor(.white.opacity(0.8))
            )
    }
    
    private var mediaButtons: some View {
        HStack(spacing: 16) {
            mediaButton(icon: "music.note")
            mediaButton(icon: nil, label: "GIF")
            mediaButton(icon: "face.smiling")
        }
    }
    
    private func mediaButton(icon: String?, label: String? = nil) -> some View {
        Button(action: {}) {
            ZStack {
                Circle()
                    .fill(Color(.systemBackground))
                    .frame(width: Constants.mediaButtonSize, height: Constants.mediaButtonSize)
                    .shadow(color: .black.opacity(0.1), radius: 4, x: 0, y: 2)
                if let label = label {
                    Text(label).font(.system(size: 14, weight: .bold)).foregroundColor(.gray)
                } else if let icon = icon {
                    Image(systemName: icon).font(.system(size: 20)).foregroundColor(.gray)
                }
            }
            .frame(width: Constants.minTapSize, height: Constants.minTapSize)
            .contentShape(Rectangle())
        }
    }
    
    private var friendSuggestions: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 8) {
                suggestionPill(name: "Duc", subtitle: "Birthday today", emoji: "🎂", color: .orange)
                suggestionPill(name: "Happy Mood", subtitle: "Better Richer Soul", emoji: "🫶", color: .red)
                suggestionPill(name: "Rock", subtitle: "Pop M...", emoji: nil, color: .blue)
            }
            .padding(.horizontal, Constants.horizontalPadding)
        }
    }
    
    private func suggestionPill(name: String, subtitle: String, emoji: String?, color: Color) -> some View {
        HStack(spacing: 8) {
            Circle()
                .fill(color.opacity(0.2))
                .frame(width: 40, height: 40)
                .overlay(
                    Group {
                        if let emoji = emoji { Text(emoji).font(.system(size: 20)) }
                        else { Image(systemName: "person.fill").foregroundColor(color) }
                    }
                )
            VStack(alignment: .leading, spacing: 2) {
                Text(name).font(.system(size: 14, weight: .semibold)).foregroundColor(.primary)
                Text(subtitle).font(.system(size: 12)).foregroundColor(.gray).lineLimit(1)
            }
        }
        .padding(.horizontal, 12)
        .padding(.vertical, 8)
        .background(RoundedRectangle(cornerRadius: 24).fill(Color(.systemBackground)).shadow(color: .black.opacity(0.05), radius: 4, x: 0, y: 2))
    }
    
    private var privacyText: some View {
        HStack(spacing: 4) {
            Text("Lê Trung, Trần, and 2 others can see your note on Messenger and Facebook for 24 hours.")
                .font(.system(size: 13)).foregroundColor(.gray)
            Button(action: {}) {
                Text("Change").font(.system(size: 13, weight: .medium)).foregroundColor(.messengerBlue)
            }
        }
        .multilineTextAlignment(.center)
        .padding(.horizontal, Constants.horizontalPadding)
    }
}

// MARK: - Triangle Shape

struct Triangle: Shape {
    func path(in rect: CGRect) -> Path {
        var path = Path()
        path.move(to: CGPoint(x: rect.midX, y: rect.maxY))
        path.addLine(to: CGPoint(x: rect.minX, y: rect.minY))
        path.addLine(to: CGPoint(x: rect.maxX, y: rect.minY))
        path.closeSubpath()
        return path
    }
}

