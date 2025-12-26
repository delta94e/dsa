import SwiftUI

// MARK: - AddYourOwnButton

/**
 A button for adding custom items with a plus icon.
 
 Displays "Add your own" text with a plus icon, styled as an
 outlined button.
 */
struct AddYourOwnButton: View {
    
    // MARK: - Properties
    
    /// Action to perform when button is tapped
    var action: () -> Void = {}
    
    // MARK: - Body
    
    var body: some View {
        Button(action: action) {
            HStack(spacing: 4) {
                Text("Add your own")
                    .font(.system(size: 14))
                    .foregroundColor(.primary)
                Image(systemName: "plus")
                    .font(.system(size: 12, weight: .medium))
                    .foregroundColor(.primary)
            }
            .padding(.horizontal, 12)
            .padding(.vertical, 8)
            .background(buttonBackground)
        }
    }
    
    // MARK: - Private Views
    
    /// Outlined button background
    private var buttonBackground: some View {
        RoundedRectangle(cornerRadius: 20)
            .stroke(Color.gray.opacity(0.3), lineWidth: 1)
    }
}

// MARK: - Preview

#Preview {
    AddYourOwnButton()
}
