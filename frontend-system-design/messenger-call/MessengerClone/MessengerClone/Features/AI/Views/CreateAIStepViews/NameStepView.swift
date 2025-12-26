import SwiftUI

// MARK: - NameStepView

/**
 Step 4: AI Name input view.
 
 Allows users to enter a name for their AI with character limit.
 Shows pastel gradient avatar placeholder.
 */
struct NameStepView: View {
    
    // MARK: - Properties
    
    /// Reference to the shared ViewModel
    @Bindable var viewModel: CreateAIViewModel
    
    /// Focus state for the name text field
    @FocusState.Binding var isNameFocused: Bool
    
    // MARK: - Constants
    
    private enum Constants {
        static let maxCharacters = 30
        static let avatarSize: CGFloat = 120
        static let focusDelay: Double = 0.3
    }
    
    // MARK: - Body
    
    var body: some View {
        VStack(spacing: 20) {
            avatarView
            titleText
            nameInput
            Spacer()
            nameSuggestions
        }
        .onAppear {
            handleOnAppear()
        }
    }
    
    // MARK: - Avatar
    
    /// Pastel gradient avatar placeholder
    private var avatarView: some View {
        ZStack {
            Circle()
                .fill(avatarGradient)
                .frame(width: Constants.avatarSize, height: Constants.avatarSize)
            
            Image(systemName: "sparkles")
                .font(.system(size: 32))
                .foregroundColor(.gray.opacity(0.5))
        }
        .padding(.top, 24)
    }
    
    /// Gradient for avatar background
    private var avatarGradient: LinearGradient {
        LinearGradient(
            colors: [
                Color(red: 0.7, green: 0.85, blue: 0.95),
                Color(red: 0.85, green: 0.75, blue: 0.9),
                Color(red: 0.8, green: 0.9, blue: 0.85),
            ],
            startPoint: .topLeading,
            endPoint: .bottomTrailing
        )
    }
    
    // MARK: - Title
    
    /// Main title text
    private var titleText: some View {
        Text("What's your AI's name?")
            .font(.system(size: 24, weight: .bold))
            .multilineTextAlignment(.center)
    }
    
    // MARK: - Name Input
    
    /// Name text field with character count
    private var nameInput: some View {
        VStack(alignment: .trailing, spacing: 4) {
            TextField("Name", text: $viewModel.aiName)
                .font(.system(size: 16))
                .padding(.horizontal, 16)
                .padding(.vertical, 14)
                .background(inputBackground)
                .focused($isNameFocused)
                .onChange(of: viewModel.aiName) { _, newValue in
                    enforceCharacterLimit(newValue)
                }
            
            characterCount
        }
        .padding(.horizontal, 16)
    }
    
    /// Background for the input field
    private var inputBackground: some View {
        RoundedRectangle(cornerRadius: 12)
            .fill(Color.gray.opacity(0.1))
    }
    
    /// Character count display
    private var characterCount: some View {
        Text("\(viewModel.aiName.count)/\(Constants.maxCharacters)")
            .font(.system(size: 13))
            .foregroundColor(.gray)
    }
    
    // MARK: - Name Suggestions
    
    /// Loading shimmer for name suggestions
    @ViewBuilder
    private var nameSuggestions: some View {
        if viewModel.isLoadingNames {
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 8) {
                    ShimmerChip(width: 120)
                    ShimmerChip(width: 140)
                }
                .padding(.horizontal, 16)
            }
            .padding(.bottom, 8)
        }
    }
    
    // MARK: - Private Methods
    
    /// Handles view appear - starts loading and focuses field
    private func handleOnAppear() {
        viewModel.startLoadingNames()
        
        DispatchQueue.main.asyncAfter(deadline: .now() + Constants.focusDelay) {
            isNameFocused = true
        }
    }
    
    /// Enforces character limit on name
    /// - Parameter newValue: The new name value
    private func enforceCharacterLimit(_ newValue: String) {
        if newValue.count > Constants.maxCharacters {
            viewModel.aiName = String(newValue.prefix(Constants.maxCharacters))
        }
    }
}
