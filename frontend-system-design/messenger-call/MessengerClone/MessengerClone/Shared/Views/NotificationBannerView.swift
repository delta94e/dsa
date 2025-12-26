import SwiftUI

struct NotificationBannerView: View {
    let senderName: String
    let message: String
    let onTap: () -> Void
    
    var body: some View {
        Button(action: onTap) {
            HStack(spacing: 12) {
                // Messenger icon
                ZStack {
                    Circle()
                        .fill(
                            LinearGradient(
                                colors: [
                                    Color(red: 0.0, green: 0.47, blue: 1.0),
                                    Color(red: 0.55, green: 0.25, blue: 1.0)
                                ],
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            )
                        )
                        .frame(width: 44, height: 44)
                    
                    Image(systemName: "message.fill")
                        .font(.system(size: 20))
                        .foregroundColor(.white)
                }
                
                VStack(alignment: .leading, spacing: 2) {
                    Text(senderName)
                        .font(.system(size: 15, weight: .semibold))
                        .foregroundColor(.primary)
                    
                    Text(message)
                        .font(.system(size: 14))
                        .foregroundColor(.gray)
                        .lineLimit(1)
                }
                
                Spacer()
                
                Text("now")
                    .font(.system(size: 13))
                    .foregroundColor(.gray)
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 12)
            .background(
                RoundedRectangle(cornerRadius: 16)
                    .fill(Color.white)
                    .shadow(color: .black.opacity(0.15), radius: 10, x: 0, y: 4)
            )
            .padding(.horizontal, 8)
        }
        .buttonStyle(PlainButtonStyle())
    }
}

// Notification Manager
class NotificationManager: ObservableObject {
    @Published var showNotification = false
    @Published var senderName = ""
    @Published var message = ""
    
    func showMessage(from sender: String, message: String) {
        self.senderName = sender
        self.message = message
        
        withAnimation(.spring(response: 0.5, dampingFraction: 0.8)) {
            self.showNotification = true
        }
        
        // Auto hide after 4 seconds
        DispatchQueue.main.asyncAfter(deadline: .now() + 4) {
            withAnimation(.spring(response: 0.5, dampingFraction: 0.8)) {
                self.showNotification = false
            }
        }
    }
    
    func dismiss() {
        withAnimation(.spring(response: 0.5, dampingFraction: 0.8)) {
            self.showNotification = false
        }
    }
}

#Preview {
    VStack {
        NotificationBannerView(
            senderName: "Nguyễn Khanh",
            message: "Má gần round cuối vẫn algo",
            onTap: {}
        )
        Spacer()
    }
    .background(Color.gray.opacity(0.2))
}
