import SwiftUI

struct HeaderView: View {
    var body: some View {
        HStack {
            // Messenger logo with gradient
            Text("messenger")
                .font(.system(size: 28, weight: .bold))
                .foregroundStyle(
                    LinearGradient(
                        colors: [.messengerBlue, Color.purple],
                        startPoint: .leading,
                        endPoint: .trailing
                    )
                )
            
            Spacer()
            
            // Right icons
            HStack(spacing: 16) {
                // Compose icon
                Button(action: {}) {
                    Image(systemName: "square.and.pencil")
                        .font(.system(size: 22))
                        .foregroundColor(.primary)
                }
                
                // Facebook icon
                Button(action: {}) {
                    ZStack {
                        Circle()
                            .fill(Color.messengerBlue)
                            .frame(width: 28, height: 28)
                        
                        Text("f")
                            .font(.system(size: 18, weight: .bold))
                            .foregroundColor(.white)
                    }
                }
            }
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 8)
    }
}

#Preview {
    HeaderView()
}
