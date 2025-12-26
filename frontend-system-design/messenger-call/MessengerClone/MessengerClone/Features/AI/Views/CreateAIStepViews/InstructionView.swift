import SwiftUI

// MARK: - InstructionView

/**
 Instruction entry view.
 
 Allows users to enter specific instructions for how
 their AI should respond.
 */
struct InstructionView: View {
    
    // MARK: - Properties
    
    /// Binding to control view presentation
    @Binding var isPresented: Bool
    
    /// Instruction text input
    @State private var instructionText = ""
    
    // MARK: - Constants
    
    private enum Constants {
        static let maxChars = 500
        static let cornerRadius: CGFloat = 10
        static let horizontalPadding: CGFloat = 16
    }
    
    // MARK: - Computed Properties
    
    /// Whether the Add button should be enabled
    private var canAdd: Bool {
        !instructionText.isEmpty
    }
    
    // MARK: - Body
    
    var body: some View {
        VStack(spacing: 0) {
            headerView
            
            ScrollView {
                VStack(alignment: .leading, spacing: 16) {
                    descriptionText
                    instructionField
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
            
            Text("Instruction")
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
        Text("Enter in specific instructions for how your AI should respond, like how it speaks or what it says in certain scenarios.")
            .font(.system(size: 14))
            .foregroundColor(.primary)
            .padding(.horizontal, Constants.horizontalPadding)
    }
    
    // MARK: - Instruction Field
    
    /// Instruction text input field
    private var instructionField: some View {
        VStack(alignment: .trailing, spacing: 4) {
            ZStack(alignment: .topLeading) {
                RoundedRectangle(cornerRadius: Constants.cornerRadius)
                    .fill(Color.gray.opacity(0.1))
                
                TextEditor(text: $instructionText)
                    .font(.system(size: 16))
                    .scrollContentBackground(.hidden)
                    .frame(minHeight: 120)
                    .padding(12)
                    .overlay(alignment: .topLeading) {
                        if instructionText.isEmpty {
                            Text("Instruction")
                                .font(.system(size: 16))
                                .foregroundColor(.gray.opacity(0.5))
                                .padding(16)
                                .allowsHitTesting(false)
                        }
                    }
            }
            .frame(minHeight: 140)
            
            Text("\(instructionText.count)/\(Constants.maxChars)")
                .font(.system(size: 13))
                .foregroundColor(.gray)
        }
        .padding(.horizontal, Constants.horizontalPadding)
    }
}

// MARK: - Preview

#Preview {
    InstructionView(isPresented: .constant(true))
}
