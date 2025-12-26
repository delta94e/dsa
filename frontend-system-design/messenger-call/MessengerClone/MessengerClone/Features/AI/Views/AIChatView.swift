import SwiftUI

struct AIChatView: View {
    let aiName: String
    let aiCreator: String
    @Binding var isPresented: Bool
    var welcomeMessage: String = "Get cozy with a great book! What's your reading vibe today?"
    var onDismissAll: (() -> Void)? = nil
    var showLoadingOnAppear: Bool = false
    @State private var messageText = ""
    @FocusState private var isMessageFocused: Bool
    
    let suggestions = [
        "Need a book to match my mood",
        "Favorite authors for a book club",
        "Hidden gems in fantasy"
    ]
    
    @State private var messages: [ChatMessage] = []
    @State private var showIntro = true
    @State private var showShareAI = false
    @State private var showNotification = true
    @State private var isPreparing = false
    
    /// Current time formatted string
    private var currentTimeString: String {
        let formatter = DateFormatter()
        formatter.dateFormat = "h:mm a"
        return formatter.string(from: Date())
    }
    
    var body: some View {
        ZStack(alignment: .top) {
            VStack(spacing: 0) {
                // Header
                HStack(spacing: 12) {
                    Button(action: {
                        // Dismiss all layers at once without animation for smooth transition
                        var transaction = Transaction()
                        transaction.disablesAnimations = true
                        withTransaction(transaction) {
                            isPresented = false
                            onDismissAll?()
                        }
                    }) {
                        Image(systemName: "xmark")
                            .font(.system(size: 18, weight: .medium))
                            .foregroundColor(.white)
                    }
                    
                    // Avatar
                    ZStack(alignment: .bottomTrailing) {
                        Circle()
                            .fill(
                                LinearGradient(
                                    colors: [.blue.opacity(0.3), .purple.opacity(0.3)],
                                    startPoint: .topLeading,
                                    endPoint: .bottomTrailing
                                )
                        )
                        .frame(width: 40, height: 40)
                        .overlay(
                            Image(systemName: "person.fill")
                                .foregroundColor(.white.opacity(0.8))
                                .font(.system(size: 18))
                        )
                    
                    // Online indicator
                    Circle()
                        .fill(Color.green)
                        .frame(width: 12, height: 12)
                        .overlay(
                            Circle()
                                .stroke(Color(red: 0.15, green: 0.15, blue: 0.15), lineWidth: 2)
                        )
                        .offset(x: 2, y: 2)
                }
                
                // Name and creator
                VStack(alignment: .leading, spacing: 2) {
                    Text(aiName)
                        .font(.system(size: 16, weight: .semibold))
                        .foregroundColor(.white)
                    
                    Text("AI by \(aiCreator)")
                        .font(.system(size: 12))
                        .foregroundColor(.white.opacity(0.6))
                }
                
                Spacer()
                
                Menu {
                    Button(action: {
                        showShareAI = true
                    }) {
                        Label("Share AI", systemImage: "square.and.arrow.up")
                    }
                    Button(action: {}) {
                        Label("View creator", systemImage: "person.circle")
                    }
                    Button(action: {}) {
                        Label("Report AI", systemImage: "exclamationmark.triangle")
                    }
                    Button(action: {}) {
                        Label("Remix AI", systemImage: "arrow.triangle.2.circlepath")
                    }
                } label: {
                    Image(systemName: "ellipsis")
                        .font(.system(size: 18))
                        .foregroundColor(.white)
                }
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 12)
            .background(Color(red: 0.15, green: 0.15, blue: 0.15))
            
            // Chat content
            ScrollView {
                VStack(spacing: 16) {
                    if showIntro {
                        // Profile intro
                        VStack(spacing: 12) {
                            // Large avatar
                            Circle()
                                .fill(
                                    LinearGradient(
                                        colors: [.blue.opacity(0.3), .purple.opacity(0.3)],
                                        startPoint: .topLeading,
                                        endPoint: .bottomTrailing
                                    )
                                )
                                .frame(width: 100, height: 100)
                                .overlay(
                                    Image(systemName: "person.fill")
                                        .foregroundColor(.white.opacity(0.8))
                                        .font(.system(size: 45))
                                )
                            
                            // Name
                            Text(aiName)
                                .font(.system(size: 20, weight: .bold))
                                .foregroundColor(.white)
                            
                            // Creator
                            Text("AI by \(aiCreator)")
                                .font(.system(size: 14))
                                .foregroundColor(.white.opacity(0.6))
                            // Disclaimer
                            VStack(spacing: 2) {
                                Text("Messages are generated by AI. Some may be")
                                    .foregroundColor(.white.opacity(0.5))
                                HStack(spacing: 4) {
                                    Text("inaccurate or inappropriate.")
                                        .foregroundColor(.white.opacity(0.5))
                                    Text("Learn more")
                                        .foregroundColor(.white)
                                        .fontWeight(.medium)
                                }
                            }
                            .font(.system(size: 13))
                            .multilineTextAlignment(.center)
                            
                            // Time
                            Text(currentTimeString)
                                .font(.system(size: 12))
                                .foregroundColor(.white.opacity(0.5))
                                .padding(.top, 8)
                            
                            // Welcome message bubble
                            HStack(alignment: .center, spacing: 8) {
                                Text(welcomeMessage)
                                    .font(.system(size: 16))
                                    .foregroundColor(.white)
                                    .padding(.horizontal, 16)
                                    .padding(.vertical, 12)
                                    .background(
                                        RoundedRectangle(cornerRadius: 20)
                                            .fill(Color.gray.opacity(0.3))
                                    )
                                
                                Button(action: {}) {
                                    Circle()
                                        .fill(Color.gray.opacity(0.3))
                                        .frame(width: 36, height: 36)
                                        .overlay(
                                            Image(systemName: "pencil")
                                                .font(.system(size: 14))
                                                .foregroundColor(.white)
                                        )
                                }
                            }
                            .padding(.top, 8)
                        }
                        .padding(.top, 20)
                        .padding(.bottom, 10)
                    }
                    
                    // Chat messages
                    ForEach(messages) { message in
                        ChatBubble(message: message)
                    }
                }
                .padding(.horizontal, 16)
                .padding(.bottom, 16)
            }
            .background(Color(red: 0.15, green: 0.15, blue: 0.15))
            
            // Bottom section with suggestions and input
            VStack(spacing: 12) {
                // Suggestion chips
                if messages.isEmpty {
                    ScrollView(.horizontal, showsIndicators: false) {
                        HStack(spacing: 8) {
                            ForEach(suggestions, id: \.self) { suggestion in
                                Button(action: {
                                    sendMessage(suggestion)
                                }) {
                                    Text(suggestion)
                                        .font(.system(size: 14))
                                        .foregroundColor(.white)
                                        .padding(.horizontal, 16)
                                        .padding(.vertical, 12)
                                        .background(
                                            RoundedRectangle(cornerRadius: 20)
                                                .fill(Color.gray.opacity(0.3))
                                        )
                                }
                            }
                        }
                        .padding(.horizontal, 16)
                    }
                }
                
                // Message input
                HStack(spacing: 12) {
                    TextField("Message \(aiName)...", text: $messageText)
                        .font(.system(size: 16))
                        .foregroundColor(.primary)
                        .padding(.horizontal, 16)
                        .padding(.vertical, 12)
                        .background(
                            RoundedRectangle(cornerRadius: 24)
                                .fill(Color.white)
                        )
                        .focused($isMessageFocused)
                        .onSubmit {
                            if !messageText.isEmpty {
                                sendMessage(messageText)
                                messageText = ""
                            }
                        }
                }
                .padding(.horizontal, 16)
            }
            .padding(.vertical, 12)
            .background(Color(red: 0.15, green: 0.15, blue: 0.15))
        }
        .background(Color(red: 0.15, green: 0.15, blue: 0.15))
        .onTapGesture {
            isMessageFocused = false
        }
        .sheet(isPresented: $showShareAI) {
            ShareAIView(
                aiName: aiName,
                aiDescription: "Chào em nha và em đúng là 1 cô gái thú vị đó",
                isPresented: $showShareAI
            )
        }
            
            // Notification banner
            if showNotification && !isPreparing {
                VStack {
                    notificationBanner
                        .transition(.move(edge: .top).combined(with: .opacity))
                    Spacer()
                }
                .animation(.easeInOut(duration: 0.3), value: showNotification)
            }
            
            // Preparing overlay
            if isPreparing {
                preparingOverlay
            }
        }
        .onAppear {
            // Show loading if requested
            if showLoadingOnAppear {
                isPreparing = true
                DispatchQueue.main.asyncAfter(deadline: .now() + 2.0) {
                    withAnimation {
                        isPreparing = false
                    }
                    // Auto dismiss notification 3 seconds AFTER loading completes
                    DispatchQueue.main.asyncAfter(deadline: .now() + 3.0) {
                        withAnimation {
                            showNotification = false
                        }
                    }
                }
            } else {
                // If no loading, dismiss notification after 3 seconds
                DispatchQueue.main.asyncAfter(deadline: .now() + 3.0) {
                    withAnimation {
                        showNotification = false
                    }
                }
            }
        }
    }
    
    // MARK: - Preparing Overlay
    
    /// Simple loading screen shown before content appears
    private var preparingOverlay: some View {
        ZStack {
            Color.white
                .ignoresSafeArea()
            
            ProgressView()
                .scaleEffect(1.5)
                .tint(.gray)
        }
    }
    
    // MARK: - Notification Banner
    
    /// Notification banner at top of screen
    private var notificationBanner: some View {
        HStack(spacing: 12) {
            // Messenger icon
            Image(systemName: "message.fill")
                .font(.system(size: 24))
                .foregroundColor(.white)
                .frame(width: 40, height: 40)
                .background(
                    LinearGradient(
                        colors: [
                            Color(red: 0.0, green: 0.5, blue: 1.0),
                            Color(red: 0.5, green: 0.3, blue: 1.0)
                        ],
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                    )
                )
                .clipShape(RoundedRectangle(cornerRadius: 10))
            
            VStack(alignment: .leading, spacing: 2) {
                HStack {
                    Text(aiName.isEmpty ? "DEBUG: EMPTY" : aiName)
                        .font(.system(size: 15, weight: .semibold))
                        .foregroundColor(aiName.isEmpty ? .red : .primary)
                    
                    Spacer()
                    
                    Text("now")
                        .font(.system(size: 13))
                        .foregroundColor(.gray)
                }
                
                Text(welcomeMessage)
                    .font(.system(size: 14))
                    .foregroundColor(.secondary)
                    .lineLimit(2)
            }
        }
        .padding(12)
        .background(
            RoundedRectangle(cornerRadius: 16)
                .fill(Color(.systemBackground))
                .shadow(color: .black.opacity(0.15), radius: 10, x: 0, y: 5)
        )
        .padding(.horizontal, 8)
        .padding(.top, 8)
        .onTapGesture {
            withAnimation {
                showNotification = false
            }
        }
    }
    
    private func sendMessage(_ text: String) {
        // Add user message
        messages.append(ChatMessage(text: text, isFromAI: false, status: "Sent"))
        showIntro = false
        
        // Simulate AI response after delay
        DispatchQueue.main.asyncAfter(deadline: .now() + 1) {
            let response = "Chào em, mình là \(aiName) - người bạn ấm áp của em!"
            messages.append(ChatMessage(text: response, isFromAI: true))
        }
    }
}

struct ChatMessage: Identifiable {
    let id = UUID()
    let text: String
    let isFromAI: Bool
    var status: String? = nil
}

struct ChatBubble: View {
    let message: ChatMessage
    
    var body: some View {
        HStack {
            if !message.isFromAI {
                Spacer()
            }
            
            VStack(alignment: message.isFromAI ? .leading : .trailing, spacing: 4) {
                Text(message.text)
                    .font(.system(size: 16))
                    .foregroundColor(message.isFromAI ? .white : .white)
                    .padding(.horizontal, 16)
                    .padding(.vertical, 12)
                    .background(
                        RoundedRectangle(cornerRadius: 20)
                            .fill(message.isFromAI ? Color.gray.opacity(0.3) : Color.messengerBlue)
                    )
                
                if let status = message.status {
                    Text(status)
                        .font(.system(size: 12))
                        .foregroundColor(.white.opacity(0.5))
                }
            }
            
            if message.isFromAI {
                Spacer()
            }
        }
    }
}

#Preview {
    AIChatView(
        aiName: "Thành Nghị (Chengyi)",
        aiCreator: "Trương Thị Tình",
        isPresented: .constant(true)
    )
}
