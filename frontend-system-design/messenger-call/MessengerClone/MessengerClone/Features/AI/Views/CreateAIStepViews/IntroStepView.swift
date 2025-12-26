import SwiftUI

// MARK: - IntroStepView

/**
 Step 5: AI Introduction input view.
 
 Allows users to enter how their AI introduces itself to people.
 Includes character limit and placeholder text.
 */
struct IntroStepView: View {
    
    // MARK: - Properties
    
    /// Reference to the shared ViewModel
    @Bindable var viewModel: CreateAIViewModel
    
    /// Focus state for the introduction text editor
    @FocusState.Binding var isIntroFocused: Bool
    
    // MARK: - Constants
    
    private enum Constants {
        static let maxCharacters = 200
        static let focusDelay: Double = 0.3
    }
    
    // MARK: - Body
    
    var body: some View {
        VStack(spacing: 20) {
            titleText
            introductionInput
            Spacer()
        }
        .onAppear {
            focusIntroField()
        }
    }
    
    // MARK: - Title
    
    /// Main title text
    private var titleText: some View {
        Text("How is your AI introduced to people?")
            .font(.system(size: 24, weight: .bold))
            .multilineTextAlignment(.center)
            .frame(maxWidth: .infinity)
            .padding(.horizontal, 20)
            .padding(.top, 24)
    }
    
    // MARK: - Introduction Input
    
    /// Text editor with clear button and character count
    private var introductionInput: some View {
        VStack(alignment: .trailing, spacing: 8) {
            ZStack(alignment: .topTrailing) {
                TextEditor(text: $viewModel.aiIntroduction)
                    .font(.system(size: 16))
                    .frame(minHeight: 100)
                    .focused($isIntroFocused)
                    .scrollContentBackground(.hidden)
                    .background(Color.clear)
                    .overlay(alignment: .topLeading) {
                        placeholderText
                    }
                    .onChange(of: viewModel.aiIntroduction) { _, newValue in
                        enforceCharacterLimit(newValue)
                    }
                
                if !viewModel.aiIntroduction.isEmpty {
                    clearButton
                }
            }
            .padding(12)
            .background(inputBackground)
            
            characterCount
        }
        .padding(.horizontal, 16)
    }
    
    /// Placeholder text when introduction is empty
    @ViewBuilder
    private var placeholderText: some View {
        if viewModel.aiIntroduction.isEmpty {
            Text("Soccer talk, no filter!")
                .font(.system(size: 16))
                .foregroundColor(.gray.opacity(0.5))
                .padding(.top, 8)
                .padding(.leading, 4)
                .allowsHitTesting(false)
        }
    }
    
    /// Button to clear the introduction
    private var clearButton: some View {
        Button(action: clearIntroduction) {
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
        Text("\(viewModel.aiIntroduction.count)/\(Constants.maxCharacters)")
            .font(.system(size: 13))
            .foregroundColor(.gray)
    }
    
    // MARK: - Private Methods
    
    /// Focuses the introduction field after a delay
    private func focusIntroField() {
        DispatchQueue.main.asyncAfter(deadline: .now() + Constants.focusDelay) {
            isIntroFocused = true
        }
    }
    
    /// Clears the introduction text
    private func clearIntroduction() {
        viewModel.aiIntroduction = ""
    }
    
    /// Enforces character limit on introduction
    /// - Parameter newValue: The new introduction value
    private func enforceCharacterLimit(_ newValue: String) {
        if newValue.count > Constants.maxCharacters {
            viewModel.aiIntroduction = String(newValue.prefix(Constants.maxCharacters))
        }
    }
}
