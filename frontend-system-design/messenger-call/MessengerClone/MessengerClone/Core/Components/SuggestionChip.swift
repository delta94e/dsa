import SwiftUI

// MARK: - SuggestionChip

/**
 A suggestion chip button for quick text suggestions.
 
 Used in the AI creation flow to provide pre-filled description options.
 
 - Parameters:
   - text: The suggestion text to display.
   - action: Closure executed when chip is tapped.
 */
struct SuggestionChip: View {
    
    // MARK: - Properties
    
    /// The suggestion text to display
    let text: String
    
    /// Action to perform when chip is tapped
    let action: () -> Void
    
    // MARK: - Body
    
    var body: some View {
        Button(action: action) {
            Text(text)
                .font(.system(size: 14))
                .foregroundColor(.primary)
                .padding(.horizontal, 16)
                .padding(.vertical, 12)
                .background(chipBackground)
        }
    }
    
    // MARK: - Private Views
    
    /// Rounded background for the chip
    private var chipBackground: some View {
        RoundedRectangle(cornerRadius: 12)
            .fill(Color.gray.opacity(0.1))
    }
}

// MARK: - Preview

#Preview {
    SuggestionChip(text: "A soccer AI that can talk strategy...", action: {})
}
