import SwiftUI

// MARK: - ShimmerChip

/**
 A loading placeholder chip with animated shimmer effect.
 
 Displays a pastel gradient with a sliding white overlay animation
 to indicate content is loading.
 
 - Parameter width: The width of the shimmer chip.
 */
struct ShimmerChip: View {
    
    // MARK: - Properties
    
    /// The width of the shimmer chip
    let width: CGFloat
    
    /// Current offset of the shimmer animation
    @State private var shimmerOffset: CGFloat = -200
    
    // MARK: - Constants
    
    private enum Constants {
        static let height: CGFloat = 36
        static let cornerRadius: CGFloat = 20
        static let shimmerWidth: CGFloat = 60
        static let animationDuration: Double = 1.5
    }
    
    // MARK: - Body
    
    var body: some View {
        RoundedRectangle(cornerRadius: Constants.cornerRadius)
            .fill(backgroundGradient)
            .frame(width: width, height: Constants.height)
            .overlay(shimmerOverlay)
            .clipShape(RoundedRectangle(cornerRadius: Constants.cornerRadius))
    }
    
    // MARK: - Private Views
    
    /// Pastel gradient background
    private var backgroundGradient: LinearGradient {
        LinearGradient(
            colors: [
                Color(red: 0.6, green: 0.8, blue: 0.95).opacity(0.6),
                Color(red: 0.9, green: 0.7, blue: 0.85).opacity(0.6),
                Color(red: 0.75, green: 0.9, blue: 0.9).opacity(0.6),
            ],
            startPoint: .leading,
            endPoint: .trailing
        )
    }
    
    /// Animated shimmer overlay
    private var shimmerOverlay: some View {
        GeometryReader { geometry in
            RoundedRectangle(cornerRadius: Constants.cornerRadius)
                .fill(shimmerGradient)
                .frame(width: Constants.shimmerWidth)
                .offset(x: shimmerOffset)
                .onAppear {
                    startShimmerAnimation(containerWidth: geometry.size.width)
                }
        }
        .clipped()
    }
    
    /// Gradient for shimmer effect
    private var shimmerGradient: LinearGradient {
        LinearGradient(
            colors: [.clear, Color.white.opacity(0.5), .clear],
            startPoint: .leading,
            endPoint: .trailing
        )
    }
    
    // MARK: - Private Methods
    
    /// Starts the infinite shimmer animation
    /// - Parameter containerWidth: Width of the container
    private func startShimmerAnimation(containerWidth: CGFloat) {
        withAnimation(
            Animation.linear(duration: Constants.animationDuration)
                .repeatForever(autoreverses: false)
        ) {
            shimmerOffset = containerWidth + 200
        }
    }
}

// MARK: - Preview

#Preview {
    VStack {
        ShimmerChip(width: 120)
        ShimmerChip(width: 80)
    }
}
