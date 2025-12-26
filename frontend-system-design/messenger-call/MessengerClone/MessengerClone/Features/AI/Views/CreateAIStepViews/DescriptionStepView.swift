import SwiftUI

// MARK: - DescriptionStepView

/**
 Step 1: AI Description input view.
 
 Allows users to describe what their AI does and what makes it unique.
 Includes suggestion chips for quick input.
 */
struct DescriptionStepView: View {
    
    // MARK: - Properties
    
    /// Reference to the shared ViewModel
    @Bindable var viewModel: CreateAIViewModel
    
    /// Focus state for the description text editor
    @FocusState.Binding var isDescriptionFocused: Bool
    
    // MARK: - Constants
    
    private enum Constants {
        static let maxCharacters = 2000
        static let focusDelay: Double = 0.3
    }
    
    // MARK: - Body
    
    var body: some View {
        VStack(spacing: 0) {
            VStack(alignment: .leading, spacing: 20) {
                titleText
                descriptionInput
            }
            
            Spacer()
            
            if viewModel.aiDescription.isEmpty {
                suggestionChips
            }
        }
        .onAppear {
            focusDescriptionField()
        }
    }
    
    // MARK: - Title
    
    /// Main title text
    private var titleText: some View {
        Text("What does your AI do and what makes it unique?")
            .font(.system(size: 24, weight: .bold))
            .multilineTextAlignment(.center)
            .frame(maxWidth: .infinity)
            .padding(.horizontal, 20)
            .padding(.top, 24)
    }
    
    // MARK: - Description Input
    
    /// Text editor with clear button and character count
    private var descriptionInput: some View {
        VStack(alignment: .trailing, spacing: 8) {
            ZStack(alignment: .topTrailing) {
                TextEditor(text: $viewModel.aiDescription)
                    .font(.system(size: 16))
                    .frame(height: 100)
                    .focused($isDescriptionFocused)
                    .scrollContentBackground(.hidden)
                    .background(Color.clear)
                    .overlay(alignment: .topLeading) {
                        placeholderText
                    }
                
                if !viewModel.aiDescription.isEmpty {
                    clearButton
                }
            }
            .padding(12)
            .background(inputBackground)
            
            characterCount
        }
        .padding(.horizontal, 16)
    }
    
    /// Placeholder text when description is empty
    @ViewBuilder
    private var placeholderText: some View {
        if viewModel.aiDescription.isEmpty {
            Text("Describe your AI")
                .font(.system(size: 16))
                .foregroundColor(.gray.opacity(0.5))
                .padding(.top, 8)
                .padding(.leading, 4)
                .allowsHitTesting(false)
        }
    }
    
    /// Button to clear the description
    private var clearButton: some View {
        Button(action: clearDescription) {
            Image(systemName: "xmark.circle.fill")
                .font(.system(size: 20))
                .foregroundColor(.gray.opacity(0.5))
        }
        .padding(.top, 4)
    }
    
    /// Background for the input field
    private var inputBackground: some View {
        RoundedRectangle(cornerRadius: 12)
            .fill(Color.gray.opacity(0.1))
    }
    
    /// Character count display
    private var characterCount: some View {
        Text("\(viewModel.aiDescription.count)/\(Constants.maxCharacters)")
            .font(.system(size: 13))
            .foregroundColor(.gray)
    }
    
    // MARK: - Suggestion Chips
    
    /// Horizontal scrolling suggestion chips
    private var suggestionChips: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 12) {
                aiIconView
                
                SuggestionChip(
                    text: "Express your inner work persona wi...",
                    action: {
                        viewModel.aiDescription = "Express your inner work persona with creativity and professionalism"
                    }
                )
                
                SuggestionChip(
                    text: "A soccer AI that can talk strategy, bante...",
                    action: {
                        viewModel.aiDescription = "A soccer AI that can talk strategy, banter over your favorite players and more."
                    }
                )
            }
            .padding(.horizontal, 16)
        }
        .padding(.bottom, 8)
    }
    
    /// AI icon at the start of suggestions
    private var aiIconView: some View {
        ZStack {
            RoundedRectangle(cornerRadius: 12)
                .fill(Color.gray.opacity(0.1))
                .frame(width: 44, height: 44)
            
            Image(systemName: "face.dashed")
                .font(.system(size: 20))
                .foregroundColor(.primary)
        }
    }
    
    // MARK: - Private Methods
    
    /// Focuses the description field after a delay
    private func focusDescriptionField() {
        DispatchQueue.main.asyncAfter(deadline: .now() + Constants.focusDelay) {
            isDescriptionFocused = true
        }
    }
    
    /// Clears the description text
    private func clearDescription() {
        viewModel.aiDescription = ""
    }
}
