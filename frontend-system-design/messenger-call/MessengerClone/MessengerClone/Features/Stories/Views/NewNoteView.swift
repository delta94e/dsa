import SwiftUI

// MARK: - NewNoteView

/**
 View for creating a new note/status to share.
 
 - Note: Users can share a thought with music, GIF, or emoji attachments.
 */
struct NewNoteView: View {
    
    // MARK: - Properties
    
    /// Controls view presentation.
    @Binding var isPresented: Bool
    
    /// The thought text input.
    @State private var thoughtText = ""
    
    /// Focus state for text field.
    @FocusState private var isTextFieldFocused: Bool
    
    // MARK: - Constants
    
    private enum Constants {
        static let horizontalPadding: CGFloat = 16
        static let avatarSize: CGFloat = 100
        static let mediaButtonSize: CGFloat = 44
        static let suggestionAvatarSize: CGFloat = 48
        static let bubbleCornerRadius: CGFloat = 20
        static let minTapSize: CGFloat = 44
    }
    
    // MARK: - Body
    
    var body: some View {
        VStack(spacing: 0) {
            // Header
            headerView
            
            Spacer()
            
            // Thought bubble
            thoughtBubble
                .padding(.bottom, 8)
            
            // Avatar
            userAvatar
                .padding(.bottom, 16)
            
            // Media buttons
            mediaButtons
                .padding(.bottom, 24)
            
            // Friend suggestions
            friendSuggestions
                .padding(.bottom, 16)
            
            // Privacy text
            privacyText
                .padding(.bottom, 12)
            
            Spacer()
        }
        .background(Color(.systemGroupedBackground))
        .onAppear {
            isTextFieldFocused = true
        }
    }
    
    // MARK: - Private Views
    
    /// Header with close and share buttons.
    private var headerView: some View {
        HStack {
            Button(action: {
                isPresented = false
            }) {
                Image(systemName: "xmark")
                    .font(.system(size: 18, weight: .medium))
                    .foregroundColor(.primary)
                    .frame(width: Constants.minTapSize, height: Constants.minTapSize)
                    .contentShape(Rectangle())
            }
            
            Spacer()
            
            Text("New note")
                .font(.system(size: 17, weight: .semibold))
            
            Spacer()
            
            Button(action: {
                // Share action
                isPresented = false
            }) {
                Text("Share")
                    .font(.system(size: 17, weight: .regular))
                    .foregroundColor(thoughtText.isEmpty ? .gray : .messengerBlue)
            }
            .disabled(thoughtText.isEmpty)
            .frame(width: 60, height: Constants.minTapSize)
            .contentShape(Rectangle())
        }
        .padding(.horizontal, Constants.horizontalPadding)
        .padding(.top, 16)
    }
    
    /// Thought input bubble.
    private var thoughtBubble: some View {
        VStack(spacing: 0) {
            TextField("Share a thought...", text: $thoughtText)
                .font(.system(size: 16))
                .multilineTextAlignment(.center)
                .focused($isTextFieldFocused)
                .padding(.horizontal, 20)
                .padding(.vertical, 12)
                .background(
                    RoundedRectangle(cornerRadius: Constants.bubbleCornerRadius)
                        .fill(Color(.systemBackground))
                        .shadow(color: .black.opacity(0.05), radius: 4, x: 0, y: 2)
                )
            
            // Bubble tail
            Triangle()
                .fill(Color(.systemBackground))
                .frame(width: 20, height: 10)
                .shadow(color: .black.opacity(0.05), radius: 2, x: 0, y: 2)
        }
        .padding(.horizontal, 60)
    }
    
    /// User avatar image.
    private var userAvatar: some View {
        Circle()
            .fill(
                LinearGradient(
                    colors: [.orange, .yellow],
                    startPoint: .topLeading,
                    endPoint: .bottomTrailing
                )
            )
            .frame(width: Constants.avatarSize, height: Constants.avatarSize)
            .overlay(
                Image(systemName: "person.fill")
                    .font(.system(size: 40))
                    .foregroundColor(.white.opacity(0.8))
            )
    }
    
    /// Music, GIF, and emoji buttons.
    private var mediaButtons: some View {
        HStack(spacing: 16) {
            mediaButton(icon: "music.note", color: .gray)
            mediaButton(icon: "text.bubble.fill", label: "GIF", color: .gray)
            mediaButton(icon: "face.smiling", color: .gray)
        }
    }
    
    /// Creates a media button with icon.
    private func mediaButton(icon: String, label: String? = nil, color: Color) -> some View {
        Button(action: {}) {
            ZStack {
                Circle()
                    .fill(Color(.systemBackground))
                    .frame(width: Constants.mediaButtonSize, height: Constants.mediaButtonSize)
                    .shadow(color: .black.opacity(0.1), radius: 4, x: 0, y: 2)
                
                if let label = label {
                    Text(label)
                        .font(.system(size: 14, weight: .bold))
                        .foregroundColor(color)
                } else {
                    Image(systemName: icon)
                        .font(.system(size: 20))
                        .foregroundColor(color)
                }
            }
            .frame(width: Constants.minTapSize, height: Constants.minTapSize)
            .contentShape(Rectangle())
        }
    }
    
    /// Friend suggestion pills.
    private var friendSuggestions: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 8) {
                suggestionPill(
                    name: "Duc",
                    subtitle: "Birthday today",
                    emoji: "🎂",
                    color: .orange
                )
                
                suggestionPill(
                    name: "Happy Mood",
                    subtitle: "Better Richer Soul",
                    emoji: "🫶",
                    color: .red
                )
                
                suggestionPill(
                    name: "Rock",
                    subtitle: "Pop M...",
                    emoji: nil,
                    color: .blue
                )
            }
            .padding(.horizontal, Constants.horizontalPadding)
        }
    }
    
    /// Creates a friend suggestion pill.
    private func suggestionPill(name: String, subtitle: String, emoji: String?, color: Color) -> some View {
        HStack(spacing: 8) {
            // Avatar
            Circle()
                .fill(color.opacity(0.2))
                .frame(width: 40, height: 40)
                .overlay(
                    Group {
                        if let emoji = emoji {
                            Text(emoji)
                                .font(.system(size: 20))
                        } else {
                            Image(systemName: "person.fill")
                                .foregroundColor(color)
                        }
                    }
                )
            
            VStack(alignment: .leading, spacing: 2) {
                Text(name)
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundColor(.primary)
                
                Text(subtitle)
                    .font(.system(size: 12))
                    .foregroundColor(.gray)
                    .lineLimit(1)
            }
        }
        .padding(.horizontal, 12)
        .padding(.vertical, 8)
        .background(
            RoundedRectangle(cornerRadius: 24)
                .fill(Color(.systemBackground))
                .shadow(color: .black.opacity(0.05), radius: 4, x: 0, y: 2)
        )
    }
    
    /// Privacy explanation text.
    private var privacyText: some View {
        HStack(spacing: 4) {
            Text("Lê Trung, Trần, and 2 others can see your note on Messenger and Facebook for 24 hours.")
                .font(.system(size: 13))
                .foregroundColor(.gray)
            
            Button(action: {}) {
                Text("Change")
                    .font(.system(size: 13, weight: .medium))
                    .foregroundColor(.messengerBlue)
            }
        }
        .multilineTextAlignment(.center)
        .padding(.horizontal, Constants.horizontalPadding)
    }
}

// MARK: - Triangle Shape

/// Triangle shape for bubble tail.
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

// MARK: - Preview

#Preview {
    NewNoteView(isPresented: .constant(true))
}
