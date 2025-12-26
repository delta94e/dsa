import SwiftUI

// MARK: - FlowLayout

/**
 A custom layout that arranges views in a flowing horizontal manner.
 
 Views are placed left-to-right and wrap to new lines when they
 exceed the available width.
 
 - Parameter spacing: The spacing between items.
 
 Example usage:
 ```swift
 FlowLayout(spacing: 8) {
     ChipButton(emoji: "😊", text: "Friend", ...)
     ChipButton(emoji: "🏅", text: "Coach", ...)
 }
 ```
 */
struct FlowLayout: Layout {
    
    // MARK: - Properties
    
    /// Spacing between items
    var spacing: CGFloat = 8
    
    // MARK: - Layout Protocol
    
    func sizeThatFits(proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) -> CGSize {
        let result = arrangeSubviews(proposal: proposal, subviews: subviews)
        return result.size
    }
    
    func placeSubviews(in bounds: CGRect, proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) {
        let result = arrangeSubviews(proposal: proposal, subviews: subviews)
        
        for (index, frame) in result.frames.enumerated() {
            let position = CGPoint(
                x: bounds.minX + frame.minX,
                y: bounds.minY + frame.minY
            )
            subviews[index].place(at: position, proposal: .unspecified)
        }
    }
    
    // MARK: - Private Methods
    
    /**
     Calculates the frames for all subviews.
     
     - Parameters:
       - proposal: The proposed view size from the parent.
       - subviews: The collection of subviews to arrange.
     
     - Returns: A tuple containing the calculated frames and total size.
     */
    private func arrangeSubviews(
        proposal: ProposedViewSize,
        subviews: Subviews
    ) -> (frames: [CGRect], size: CGSize) {
        let maxWidth = proposal.width ?? .infinity
        var frames: [CGRect] = []
        var currentX: CGFloat = 0
        var currentY: CGFloat = 0
        var lineHeight: CGFloat = 0
        
        for subview in subviews {
            let size = subview.sizeThatFits(.unspecified)
            
            // Wrap to next line if needed
            if currentX + size.width > maxWidth && currentX > 0 {
                currentX = 0
                currentY += lineHeight + spacing
                lineHeight = 0
            }
            
            frames.append(CGRect(x: currentX, y: currentY, width: size.width, height: size.height))
            lineHeight = max(lineHeight, size.height)
            currentX += size.width + spacing
        }
        
        let totalSize = CGSize(width: maxWidth, height: currentY + lineHeight)
        return (frames, totalSize)
    }
}

// MARK: - Preview

#Preview {
    FlowLayout(spacing: 8) {
        Text("Item 1").padding(8).background(Color.gray.opacity(0.2))
        Text("Item 2").padding(8).background(Color.gray.opacity(0.2))
        Text("Longer Item 3").padding(8).background(Color.gray.opacity(0.2))
        Text("Item 4").padding(8).background(Color.gray.opacity(0.2))
    }
    .padding()
}
