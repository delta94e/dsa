import SwiftUI

// MARK: - ChipButton

/**
 A selectable chip button with emoji and text.
 
 Used for role and trait selection in the AI creation flow.
 
 - Note: Supports selected state with visual feedback.
 */
struct ChipButton: View {
    
    // MARK: - Properties
    
    /// The emoji to display on the left side
    let emoji: String
    
    /// The text label for the chip
    let text: String
    
    /// Whether the chip is currently selected
    let isSelected: Bool
    
    /// Action to perform when chip is tapped
    let action: () -> Void
    
    // MARK: - Body
    
    var body: some View {
        Button(action: action) {
            HStack(spacing: 4) {
                Text(emoji)
                    .font(.system(size: 14))
                Text(text)
                    .font(.system(size: 14, weight: .medium))
                    .foregroundColor(isSelected ? .messengerBlue : .primary)
            }
            .padding(.horizontal, 12)
            .padding(.vertical, 8)
            .background(chipBackground)
            .overlay(chipBorder)
        }
    }
    
    // MARK: - Private Views
    
    /// Background fill based on selection state
    private var chipBackground: some View {
        RoundedRectangle(cornerRadius: 20)
            .fill(isSelected ? Color.messengerBlue.opacity(0.1) : Color.gray.opacity(0.1))
    }
    
    /// Border stroke based on selection state
    private var chipBorder: some View {
        RoundedRectangle(cornerRadius: 20)
            .stroke(isSelected ? Color.messengerBlue : Color.clear, lineWidth: 1)
    }
}

// MARK: - Preview

#Preview {
    HStack {
        ChipButton(emoji: "😊", text: "Friend", isSelected: false, action: {})
        ChipButton(emoji: "🏅", text: "Coach", isSelected: true, action: {})
    }
}
