import SwiftUI

// MARK: - ReviewStepView

/**
 Review screen for final AI creation review.
 
 Displays all entered information and allows final edits
 before creating the AI.
 */
struct ReviewStepView: View {
    
    // MARK: - Properties
    
    /// Reference to the shared ViewModel
    @Bindable var viewModel: CreateAIViewModel
    
    /// Binding to control main view presentation
    @Binding var isPresented: Bool
    
    /// Binding to control review screen presentation
    @Binding var showReview: Bool
    
    /// Callback to dismiss all the way to home screen
    var onDismissToHome: (() -> Void)? = nil
    
    /// Callback when AI creation is complete
    var onCreateAIComplete: ((String, String) -> Void)? = nil
    
    /// Whether to show audience settings
    @State private var showAudienceSettings = false
    
    /// Whether to show advanced settings
    @State private var showAdvancedSettings = false
    
    /// Whether to show preparing overlay (no longer used - handled in AIChatView)
    @State private var isPreparing = false
    
    // MARK: - Constants
    
    private enum Constants {
        static let avatarSize: CGFloat = 140
        static let editButtonSize: CGFloat = 32
        static let maxNameCharacters = 30
        static let maxDescriptionCharacters = 2000
    }
    
    // MARK: - Body
    
    var body: some View {
        ZStack {
            VStack(spacing: 0) {
                headerView
                
                ScrollView {
                    VStack(spacing: 24) {
                        avatarSection
                        nameField
                        descriptionField
                        Divider().padding(.horizontal, 16)
                        audienceRow
                        advancedSettingsRow
                        remixingToggle
                    }
                }
                
                chatButton
            }
            .background(Color.white)
            .scrollDismissesKeyboard(.interactively)
            .fullScreenCover(isPresented: $showAudienceSettings) {
                AudienceSettingsView(isPresented: $showAudienceSettings)
            }
            .fullScreenCover(isPresented: $showAdvancedSettings) {
                AdvancedSettingsView(isPresented: $showAdvancedSettings, viewModel: viewModel)
            }
            
            // Preparing overlay
            if isPreparing {
                preparingOverlay
            }
        }
    }
    
    // MARK: - Preparing Overlay
    
    /// Loading overlay shown when preparing AI
    private var preparingOverlay: some View {
        ZStack {
            // Full screen dimmed background
            Color.black.opacity(0.4)
                .ignoresSafeArea()
            
            // Preparing popup
            VStack(spacing: 12) {
                ProgressView()
                    .scaleEffect(1.5)
                    .tint(.gray)
                
                Text("Preparing")
                    .font(.system(size: 17, weight: .semibold))
                    .foregroundColor(.primary)
                
                Text("This may take a minute")
                    .font(.system(size: 14))
                    .foregroundColor(.gray)
            }
            .padding(32)
            .background(
                RoundedRectangle(cornerRadius: 16)
                    .fill(Color.white)
                    .shadow(color: .black.opacity(0.1), radius: 20, x: 0, y: 4)
            )
        }
    }
    
    // MARK: - Header
    
    /// Navigation header with back and cancel buttons
    private var headerView: some View {
        HStack {
            Button(action: { showReview = false }) {
                Image(systemName: "chevron.left")
                    .font(.system(size: 20, weight: .medium))
                    .foregroundColor(.primary)
            }
            
            Spacer()
            
            Text("Create an AI")
                .font(.system(size: 17, weight: .semibold))
            
            Spacer()
            
            Button("Cancel") {
                isPresented = false
            }
            .font(.system(size: 17))
            .foregroundColor(.messengerBlue)
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 12)
        .background(Color.white)
    }
    
    // MARK: - Avatar Section
    
    /// Avatar with edit button overlay
    private var avatarSection: some View {
        ZStack(alignment: .bottomTrailing) {
            avatarImage
            editAvatarButton
        }
        .padding(.top, 16)
    }
    
    /// Main avatar image
    private var avatarImage: some View {
        Circle()
            .fill(avatarGradient)
            .frame(width: Constants.avatarSize, height: Constants.avatarSize)
            .overlay(
                Image(systemName: "person.fill")
                    .font(.system(size: 50))
                    .foregroundColor(.white.opacity(0.8))
            )
    }
    
    /// Gradient for avatar background
    private var avatarGradient: LinearGradient {
        LinearGradient(
            colors: [
                Color(red: 0.1, green: 0.2, blue: 0.4),
                Color(red: 0.2, green: 0.4, blue: 0.5),
            ],
            startPoint: .top,
            endPoint: .bottom
        )
    }
    
    /// Edit button overlay on avatar
    private var editAvatarButton: some View {
        Button(action: {}) {
            Circle()
                .fill(Color.black.opacity(0.7))
                .frame(width: Constants.editButtonSize, height: Constants.editButtonSize)
                .overlay(
                    Image(systemName: "pencil")
                        .font(.system(size: 14))
                        .foregroundColor(.white)
                )
        }
    }
    
    // MARK: - Name Field
    
    /// Editable name field with character count
    private var nameField: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text("Name")
                .font(.system(size: 13))
                .foregroundColor(.gray)
            
            HStack {
                TextField("", text: $viewModel.aiName)
                    .font(.system(size: 16))
                
                Text("\(viewModel.aiName.count)/\(Constants.maxNameCharacters)")
                    .font(.system(size: 13))
                    .foregroundColor(.gray)
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 14)
            .background(fieldBackground)
        }
        .padding(.horizontal, 16)
    }
    
    // MARK: - Description Field
    
    /// Editable description field with character count
    private var descriptionField: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text("Description")
                .font(.system(size: 13))
                .foregroundColor(.gray)
            
            VStack(alignment: .trailing, spacing: 4) {
                TextEditor(text: $viewModel.aiDescription)
                    .font(.system(size: 16))
                    .frame(minHeight: 120)
                    .scrollContentBackground(.hidden)
                
                Text("\(viewModel.aiDescription.count)/\(Constants.maxDescriptionCharacters)")
                    .font(.system(size: 13))
                    .foregroundColor(.gray)
            }
            .padding(12)
            .background(fieldBackground)
        }
        .padding(.horizontal, 16)
    }
    
    /// Background for input fields
    private var fieldBackground: some View {
        RoundedRectangle(cornerRadius: 12)
            .fill(Color.gray.opacity(0.1))
    }
    
    // MARK: - Settings Rows
    
    /// Audience selection row
    private var audienceRow: some View {
        Button(action: { showAudienceSettings = true }) {
            HStack {
                Image(systemName: "eye")
                    .font(.system(size: 18))
                    .foregroundColor(.primary)
                
                Text("Audience")
                    .font(.system(size: 16))
                    .foregroundColor(.primary)
                
                Spacer()
                
                Text("Public")
                    .font(.system(size: 16))
                    .foregroundColor(.gray)
                
                Image(systemName: "chevron.right")
                    .font(.system(size: 14))
                    .foregroundColor(.gray)
            }
            .padding(.horizontal, 16)
        }
    }
    
    /// Advanced settings row
    private var advancedSettingsRow: some View {
        Button(action: { showAdvancedSettings = true }) {
            HStack {
                Image(systemName: "gearshape")
                    .font(.system(size: 18))
                    .foregroundColor(.primary)
                
                Text("Advanced settings")
                    .font(.system(size: 16))
                    .foregroundColor(.primary)
                
                Spacer()
                
                Image(systemName: "chevron.right")
                    .font(.system(size: 14))
                    .foregroundColor(.gray)
            }
            .padding(.horizontal, 16)
        }
    }
    
    /// Reusable settings row with chevron
    private func settingsRow(icon: String, title: String, value: String?) -> some View {
        Button(action: {}) {
            HStack {
                Image(systemName: icon)
                    .font(.system(size: 18))
                    .foregroundColor(.primary)
                
                Text(title)
                    .font(.system(size: 16))
                    .foregroundColor(.primary)
                
                Spacer()
                
                if let value = value {
                    Text(value)
                        .font(.system(size: 16))
                        .foregroundColor(.gray)
                }
                
                Image(systemName: "chevron.right")
                    .font(.system(size: 14))
                    .foregroundColor(.gray)
            }
            .padding(.horizontal, 16)
        }
    }
    
    // MARK: - Remixing Toggle
    
    /// Toggle for allowing remixing
    private var remixingToggle: some View {
        HStack(alignment: .top) {
            Image(systemName: "arrow.triangle.2.circlepath")
                .font(.system(size: 18))
                .foregroundColor(.primary)
            
            VStack(alignment: .leading, spacing: 2) {
                Text("Remixing")
                    .font(.system(size: 16))
                    .foregroundColor(.primary)
                
                Text("Allow people to create other AIs based on this one.")
                    .font(.system(size: 13))
                    .foregroundColor(.gray)
            }
            
            Spacer()
            
            CustomToggle(isOn: $viewModel.allowRemixing)
        }
        .padding(.horizontal, 16)
    }
    
    // MARK: - Chat Button
    
    /// Primary action button to chat with AI
    private var chatButton: some View {
        Button(action: {
            // Show preparing overlay first
            isPreparing = true
            
            // After delay, trigger callback (HeaderView shows AIChatView then dismisses layers)
            DispatchQueue.main.asyncAfter(deadline: .now() + 2.0) {
                let welcomeMessage = viewModel.aiIntroduction.isEmpty 
                    ? "Get cozy with a great book! What's your reading vibe today?" 
                    : viewModel.aiIntroduction
                
                isPreparing = false
                onCreateAIComplete?(viewModel.aiName, welcomeMessage)
            }
        }) {
            Text("Chat with AI")
                .font(.system(size: 17, weight: .semibold))
                .foregroundColor(isPreparing ? .gray : .white)
                .frame(maxWidth: .infinity)
                .padding(.vertical, 16)
                .background(
                    RoundedRectangle(cornerRadius: 30)
                        .fill(isPreparing ? Color.gray.opacity(0.3) : Color.messengerBlue)
                )
        }
        .disabled(isPreparing)
        .padding(.horizontal, 16)
        .padding(.vertical, 12)
        .background(Color.white)
    }
}
