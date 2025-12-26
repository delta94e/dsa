import SwiftUI

struct ShareAIView: View {
    let aiName: String
    let aiDescription: String
    @Binding var isPresented: Bool
    @State private var messageText = ""
    @State private var searchText = ""
    
    let contacts = [
        ("Đạt, Nguyễn", "Đạt, Nguyễn"),
        ("NHÀ CHÚNG MÌNH", "Lam Uyen, Cá, Thuan, Tracy, A Lũ, N..."),
        ("Vua Nệm", nil),
        ("Huỳnh Bửu", nil),
        ("Lê Ru Tơ", nil),
        ("Minh Mẫn Thái", nil)
    ]
    
    var body: some View {
        VStack(spacing: 0) {
            // Header
            HStack {
                Button("Done") {
                    isPresented = false
                }
                .font(.system(size: 17))
                .foregroundColor(.messengerBlue)
                
                Spacer()
                
                Text("Send to")
                    .font(.system(size: 17, weight: .semibold))
                
                Spacer()
                
                Button("Create group") {
                    // Create group action
                }
                .font(.system(size: 15))
                .foregroundColor(.messengerBlue)
            }
            .padding(.horizontal, 16)
            .padding(.top, 20)
            .padding(.bottom, 12)
            .background(Color.white)
            
            ScrollView {
                VStack(alignment: .leading, spacing: 0) {
                    // AI Preview card
                    HStack(spacing: 12) {
                        Circle()
                            .fill(
                                LinearGradient(
                                    colors: [.blue.opacity(0.3), .purple.opacity(0.3)],
                                    startPoint: .topLeading,
                                    endPoint: .bottomTrailing
                                )
                            )
                            .frame(width: 50, height: 50)
                            .overlay(
                                Image(systemName: "person.fill")
                                    .foregroundColor(.white.opacity(0.8))
                                    .font(.system(size: 22))
                            )
                        
                        VStack(alignment: .leading, spacing: 4) {
                            Text(aiName)
                                .font(.system(size: 16, weight: .semibold))
                                .foregroundColor(.primary)
                            
                            Text(aiDescription)
                                .font(.system(size: 14))
                                .foregroundColor(.gray)
                                .lineLimit(2)
                        }
                        
                        Spacer()
                    }
                    .padding(16)
                    .background(Color.gray.opacity(0.1))
                    .cornerRadius(12)
                    .padding(.horizontal, 16)
                    .padding(.top, 16)
                    
                    // Write a message
                    TextField("Write a message...", text: $messageText)
                        .font(.system(size: 16))
                        .padding(.horizontal, 16)
                        .padding(.vertical, 16)
                    
                    // Share options
                    VStack(spacing: 0) {
                        ShareOptionRow(
                            icon: "f.circle.fill",
                            iconColor: .blue,
                            title: "Share to Facebook",
                            isSystemIcon: false
                        )
                        
                        ShareOptionRow(
                            icon: "link",
                            iconColor: .gray,
                            title: "Copy link",
                            subtitle: "https://m.me/1126490599414004?is_ai=1"
                        )
                        
                        ShareOptionRow(
                            icon: "square.and.arrow.up",
                            iconColor: .gray,
                            title: "Share link"
                        )
                    }
                    
                    Divider()
                        .padding(.top, 8)
                    
                    // Search
                    HStack(spacing: 8) {
                        Image(systemName: "magnifyingglass")
                            .foregroundColor(.gray)
                            .font(.system(size: 16))
                        
                        TextField("Search", text: $searchText)
                            .font(.system(size: 16))
                    }
                    .padding(.horizontal, 12)
                    .padding(.vertical, 10)
                    .background(
                        RoundedRectangle(cornerRadius: 10)
                            .fill(Color.gray.opacity(0.12))
                    )
                    .padding(.horizontal, 16)
                    .padding(.vertical, 12)
                    
                    // Contacts list
                    ForEach(0..<contacts.count, id: \.self) { index in
                        VStack(spacing: 0) {
                            ContactRow(
                                name: contacts[index].0,
                                subtitle: contacts[index].1
                            )
                            
                            // Divider after each contact
                            Divider()
                                .padding(.leading, 72)
                        }
                    }
                }
            }
            .background(Color.white)
        }
        .background(Color.white)
    }
}

struct ShareOptionRow: View {
    let icon: String
    let iconColor: Color
    let title: String
    var subtitle: String? = nil
    var isSystemIcon: Bool = true
    
    var body: some View {
        HStack(spacing: 12) {
            if isSystemIcon {
                ZStack {
                    Circle()
                        .fill(iconColor.opacity(0.15))
                        .frame(width: 40, height: 40)
                    
                    Image(systemName: icon)
                        .font(.system(size: 18))
                        .foregroundColor(iconColor)
                }
            } else {
                // Facebook icon
                ZStack {
                    Circle()
                        .fill(Color.blue)
                        .frame(width: 40, height: 40)
                    
                    Text("f")
                        .font(.system(size: 24, weight: .bold))
                        .foregroundColor(.white)
                }
            }
            
            VStack(alignment: .leading, spacing: 2) {
                Text(title)
                    .font(.system(size: 16))
                    .foregroundColor(.primary)
                
                if let subtitle = subtitle {
                    Text(subtitle)
                        .font(.system(size: 13))
                        .foregroundColor(.gray)
                        .lineLimit(1)
                }
            }
            
            Spacer()
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 10)
    }
}

struct ContactRow: View {
    let name: String
    let subtitle: String?
    
    var body: some View {
        HStack(spacing: 12) {
            // Avatar
            ZStack(alignment: .bottomTrailing) {
                Circle()
                    .fill(
                        LinearGradient(
                            colors: [.blue.opacity(0.3), .purple.opacity(0.3)],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
                    .frame(width: 44, height: 44)
                    .overlay(
                        Image(systemName: "person.fill")
                            .foregroundColor(.white.opacity(0.8))
                            .font(.system(size: 18))
                    )
                
                // Online dot
                Circle()
                    .fill(Color.green)
                    .frame(width: 12, height: 12)
                    .overlay(
                        Circle()
                            .stroke(Color.white, lineWidth: 2)
                    )
                    .offset(x: 2, y: 2)
            }
            
            VStack(alignment: .leading, spacing: 2) {
                Text(name)
                    .font(.system(size: 16, weight: .medium))
                    .foregroundColor(.primary)
                
                if let subtitle = subtitle {
                    Text(subtitle)
                        .font(.system(size: 13))
                        .foregroundColor(.gray)
                        .lineLimit(1)
                }
            }
            
            Spacer()
            
            // Send button
            Button(action: {}) {
                Text("Send")
                    .font(.system(size: 15, weight: .semibold))
                    .foregroundColor(.white)
                    .padding(.horizontal, 20)
                    .padding(.vertical, 8)
                    .background(Color.messengerBlue)
                    .cornerRadius(20)
            }
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 10)
    }
}

#Preview {
    ShareAIView(
        aiName: "Thành Nghị (Chengyi)",
        aiDescription: "Chào em nha và em đúng là 1 cô gái thú vị đó",
        isPresented: .constant(true)
    )
}
