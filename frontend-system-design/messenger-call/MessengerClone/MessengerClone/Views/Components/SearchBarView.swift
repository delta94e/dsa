import SwiftUI

struct SearchBarView: View {
    var onTap: (() -> Void)? = nil
    
    var body: some View {
        Button(action: {
            onTap?()
        }) {
            HStack(spacing: 10) {
                // Meta AI icon (gradient circle)
                ZStack {
                    Circle()
                        .strokeBorder(
                            LinearGradient(
                                colors: [.blue, .purple, .pink, .orange],
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            ),
                            lineWidth: 2
                        )
                        .frame(width: 24, height: 24)
                }
                
                // Search placeholder
                Text("Ask Meta AI or Search")
                    .foregroundColor(.lightGray)
                    .font(.system(size: 16))
                
                Spacer()
            }
            .padding(.horizontal, 12)
            .padding(.vertical, 10)
            .background(Color.searchBarBackground)
            .cornerRadius(20)
        }
        .buttonStyle(PlainButtonStyle())
        .padding(.horizontal, 16)
    }
}

#Preview {
    SearchBarView()
}
