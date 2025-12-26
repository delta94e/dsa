import SwiftUI

// MARK: - AIChatData

/// Data structure to pass AI chat information.
struct AIChatData: Identifiable {
    let id = UUID()
    let aiName: String
    let welcomeMessage: String
}

// MARK: - HeaderView

/**
 Main header view displaying the messenger logo and action buttons.
 
 - Note: Also handles presenting NewMessageView and AIChatView.
 */
struct HeaderView: View {
    
    // MARK: - Properties
    
    /// Global loading manager from environment.
    var globalLoadingManager: GlobalLoadingManager
    
    /// Controls NewMessageView sheet presentation.
    @State private var showNewMessage = false
    
    /// AI chat data for presentation (nil = not showing).
    @State private var aiChatData: AIChatData?
    
    // MARK: - Constants
    
    private enum Constants {
        static let logoSize: CGFloat = 28
        static let iconSize: CGFloat = 22
        static let facebookIconSize: CGFloat = 28
        static let facebookLetterSize: CGFloat = 18
        static let iconSpacing: CGFloat = 16
        static let horizontalPadding: CGFloat = 16
        static let verticalPadding: CGFloat = 8
    }
    
    // MARK: - Body
    
    var body: some View {
        HStack {
            messengerLogo
            Spacer()
            actionButtons
        }
        .padding(.horizontal, Constants.horizontalPadding)
        .padding(.vertical, Constants.verticalPadding)
        .sheet(isPresented: $showNewMessage) {
            NewMessageView(
                isPresented: $showNewMessage,
                onCreateAIComplete: handleCreateAIComplete
            )
        }
        .fullScreenCover(item: $aiChatData) { data in
            AIChatView(
                aiName: data.aiName,
                aiCreator: "Nguyễn Hữu Trương",
                isPresented: Binding(
                    get: { aiChatData != nil },
                    set: { if !$0 { aiChatData = nil } }
                ),
                welcomeMessage: data.welcomeMessage,
                showLoadingOnAppear: true
            )
        }
    }
    
    // MARK: - Private Views
    
    /// Messenger logo with gradient styling.
    private var messengerLogo: some View {
        Text("messenger")
            .font(.system(size: Constants.logoSize, weight: .bold))
            .foregroundStyle(
                LinearGradient(
                    colors: [.messengerBlue, Color.purple],
                    startPoint: .leading,
                    endPoint: .trailing
                )
            )
    }
    
    /// Right-side action buttons.
    private var actionButtons: some View {
        HStack(spacing: Constants.iconSpacing) {
            composeButton
            facebookButton
        }
    }
    
    /// Compose new message button.
    private var composeButton: some View {
        Button(action: {
            showNewMessage = true
        }) {
            Image(systemName: "square.and.pencil")
                .font(.system(size: Constants.iconSize))
                .foregroundColor(.primary)
                .frame(width: 44, height: 44)
                .contentShape(Rectangle())
        }
    }
    
    /// Facebook icon button.
    private var facebookButton: some View {
        Button(action: {}) {
            ZStack {
                Circle()
                    .fill(Color.messengerBlue)
                    .frame(width: Constants.facebookIconSize, height: Constants.facebookIconSize)
                
                Text("f")
                    .font(.system(size: Constants.facebookLetterSize, weight: .bold))
                    .foregroundColor(.white)
            }
            .frame(width: 44, height: 44)
            .contentShape(Rectangle())
        }
    }
    
    // MARK: - Private Methods
    
    /**
     Handles AI creation completion callback.
     
     - Parameters:
       - aiName: The name of the created AI.
       - welcomeMessage: The welcome message for the AI.
     */
    private func handleCreateAIComplete(_ aiName: String, _ welcomeMessage: String) {
        // Create data object with AI info
        let data = AIChatData(aiName: aiName, welcomeMessage: welcomeMessage)
        
        // Show AIChatView instantly (no animation) with the data
        var transaction = Transaction()
        transaction.disablesAnimations = true
        withTransaction(transaction) {
            aiChatData = data
            showNewMessage = false
        }
    }
}

// MARK: - Preview

#Preview {
    HeaderView(globalLoadingManager: GlobalLoadingManager())
}
