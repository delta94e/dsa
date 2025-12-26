import SwiftUI

// MARK: - CustomToggle

/**
 A custom toggle with a circular knob and smooth animation.
 
 Replicates iOS-style toggle with customizable tint color
 and perfect circular thumb.
 
 - Parameters:
   - isOn: Binding to the toggle state.
   - tintColor: Color for the active state (default: messengerBlue).
 */
struct CustomToggle: View {
    
    // MARK: - Properties
    
    /// Binding to the toggle's on/off state
    @Binding var isOn: Bool
    
    /// Tint color for the active state
    var tintColor: Color = .messengerBlue
    
    // MARK: - Constants
    
    private enum Constants {
        static let width: CGFloat = 51
        static let height: CGFloat = 31
        static let thumbSize: CGFloat = 27
        static let thumbPadding: CGFloat = 2
        static let animationDuration: Double = 0.2
        static let shadowRadius: CGFloat = 2
        static let shadowOpacity: Double = 0.15
    }
    
    // MARK: - Body
    
    var body: some View {
        Button(action: toggleAction) {
            ZStack(alignment: isOn ? .trailing : .leading) {
                trackView
                thumbView
            }
            .animation(.easeInOut(duration: Constants.animationDuration), value: isOn)
        }
        .buttonStyle(.plain)
    }
    
    // MARK: - Private Views
    
    /// The track/background of the toggle
    private var trackView: some View {
        Capsule()
            .fill(isOn ? tintColor : Color.gray.opacity(0.3))
            .frame(width: Constants.width, height: Constants.height)
    }
    
    /// The circular thumb/knob
    private var thumbView: some View {
        Circle()
            .fill(Color.white)
            .frame(width: Constants.thumbSize, height: Constants.thumbSize)
            .shadow(
                color: .black.opacity(Constants.shadowOpacity),
                radius: Constants.shadowRadius,
                x: 0,
                y: 1
            )
            .padding(Constants.thumbPadding)
    }
    
    // MARK: - Private Methods
    
    /// Handles toggle tap action with animation
    private func toggleAction() {
        withAnimation(.easeInOut(duration: Constants.animationDuration)) {
            isOn.toggle()
        }
    }
}

// MARK: - Preview

#Preview {
    VStack(spacing: 20) {
        CustomToggle(isOn: .constant(true))
        CustomToggle(isOn: .constant(false))
    }
}
