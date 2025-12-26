import SwiftUI

// MARK: - ExampleDialogueView

/**
 Example dialogue entry view.
 
 Allows users to enter prompts and responses to define
 the AI's conversational style.
 */
struct ExampleDialogueView: View {
    
    // MARK: - Properties
    
    /// Binding to control view presentation
    @Binding var isPresented: Bool
    
    /// Prompt text input
    @State private var promptText = ""
    
    /// Response text input
    @State private var responseText = ""
    
    // MARK: - Constants
    
    private enum Constants {
        static let promptMaxChars = 200
        static let responseMaxChars = 400
        static let cornerRadius: CGFloat = 10
        static let horizontalPadding: CGFloat = 16
    }
    
    // MARK: - Computed Properties
    
    /// Whether the Add button should be enabled
    private var canAdd: Bool {
        !promptText.isEmpty && !responseText.isEmpty
    }
    
    // MARK: - Body
    
    var body: some View {
        VStack(spacing: 0) {
            headerView
            
            ScrollView {
                VStack(alignment: .leading, spacing: 16) {
                    descriptionText
                    promptField
                    responseField
                }
                .padding(.top, 16)
            }
        }
        .background(Color.white)
    }
    
    // MARK: - Header
    
    /// Navigation header with Cancel and Add buttons
    private var headerView: some View {
        HStack {
            Button("Cancel") {
                isPresented = false
            }
            .font(.system(size: 17))
            .foregroundColor(.messengerBlue)
            
            Spacer()
            
            Text("Example dialogue")
                .font(.system(size: 17, weight: .semibold))
            
            Spacer()
            
            Button("Add") {
                isPresented = false
            }
            .font(.system(size: 17))
            .foregroundColor(canAdd ? .messengerBlue : .gray.opacity(0.5))
            .disabled(!canAdd)
        }
        .padding(.horizontal, Constants.horizontalPadding)
        .padding(.vertical, 12)
        .background(Color.white)
    }
    
    // MARK: - Description
    
    /// Description text explaining the feature
    private var descriptionText: some View {
        Text("Enter prompts and answer them in the specific style you want your AI to exhibit. The more unique your answers, the more refined your AI will be.")
            .font(.system(size: 14))
            .foregroundColor(.primary)
            .padding(.horizontal, Constants.horizontalPadding)
    }
    
    // MARK: - Prompt Field
    
    /// Prompt text input field
    private var promptField: some View {
        VStack(alignment: .trailing, spacing: 4) {
            ZStack(alignment: .topLeading) {
                RoundedRectangle(cornerRadius: Constants.cornerRadius)
                    .fill(Color.gray.opacity(0.1))
                
                TextEditor(text: $promptText)
                    .font(.system(size: 16))
                    .scrollContentBackground(.hidden)
                    .frame(minHeight: 100)
                    .padding(12)
                    .overlay(alignment: .topLeading) {
                        if promptText.isEmpty {
                            Text("Prompt")
                                .font(.system(size: 16))
                                .foregroundColor(.gray.opacity(0.5))
                                .padding(16)
                                .allowsHitTesting(false)
                        }
                    }
            }
            .frame(minHeight: 120)
            
            Text("\(promptText.count)/\(Constants.promptMaxChars)")
                .font(.system(size: 13))
                .foregroundColor(.gray)
        }
        .padding(.horizontal, Constants.horizontalPadding)
    }
    
    // MARK: - Response Field
    
    /// Response text input field
    private var responseField: some View {
        VStack(alignment: .trailing, spacing: 4) {
            ZStack(alignment: .topLeading) {
                RoundedRectangle(cornerRadius: Constants.cornerRadius)
                    .fill(Color.gray.opacity(0.1))
                
                TextEditor(text: $responseText)
                    .font(.system(size: 16))
                    .scrollContentBackground(.hidden)
                    .frame(minHeight: 120)
                    .padding(12)
                    .overlay(alignment: .topLeading) {
                        if responseText.isEmpty {
                            Text("Response")
                                .font(.system(size: 16))
                                .foregroundColor(.gray.opacity(0.5))
                                .padding(16)
                                .allowsHitTesting(false)
                        }
                    }
            }
            .frame(minHeight: 140)
            
            Text("\(responseText.count)/\(Constants.responseMaxChars)")
                .font(.system(size: 13))
                .foregroundColor(.gray)
        }
        .padding(.horizontal, Constants.horizontalPadding)
    }
}

// MARK: - Preview

#Preview {
    ExampleDialogueView(isPresented: .constant(true))
}
