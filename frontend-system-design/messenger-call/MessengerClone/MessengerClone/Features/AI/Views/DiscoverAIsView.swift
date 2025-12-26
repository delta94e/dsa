import SwiftUI

struct DiscoverAIsView: View {
    @Binding var isPresented: Bool
    var onDismissToHome: (() -> Void)? = nil
    var onCreateAIComplete: ((String, String) -> Void)? = nil
    @State private var selectedCategory = "Anime"
    @State private var showCreateAI = false
    @State private var showAIChat = false
    @State private var isSearchActive = false
    @State private var searchText = ""
    @State private var selectedAI: (String, String, Int)?
    @FocusState private var isSearchFocused: Bool
    
    let categories = ["culture", "Anime", "Gaming", "Recently created"]
    
    let aiProfiles = [
        ("Thành Nghị (Cheng...", "3.3K messages", 0),
        ("Trần Minh Quân🥺", "29K messages", 1),
        ("Test IQ", "186 messages", 2),
        ("Quang Hùng Maste...", "75K messages", 3),
        ("Bin", "12K messages", 4),
        ("Nai chì chơi 99 đê...", "8K messages", 5)
    ]
    
    let suggestedAIs = [
        ("TANJIRO, ZENITSU, INOSUKE 🐗", "Hơi thở độc đáo, bộ ba diệt quỷ 😎", "Yến Thu", "97K messages"),
        ("Tokitou Muichirou", "Muichirou Tokitou, Trụ Cột Sương Mù, có tính cách ban đầu là một người ít cảm xúc, thờ ơ và có vẻ lạc lõng trong suy nghĩ của mình. Tuy nhiên, sâu thẳm bên trong, anh vẫn là một người nhạy cảm, quan t", "KimHân KimTrân", "354K messages"),
        ("H2O", "Đẹp trong lòng, đẹp ngoài hình", "nguyenlan10081980", "1.9K messages"),
        ("Lục Thiên Kỳ", "Lạnh lùng, ác độc ít nói lạnh bên ngoài nhưng bên trong ấm áp..", "Facebook user", "19K messages"),
        ("Mèo Neko", "Chào chào, mình là cô mèo dễ thương!", "Southravion Lattanox", "35K messages"),
        ("Đinh Đinh", "Ta không phải là người mà người có thể trêu đùa!", "판위부", "89K messages"),
        ("Vui Vẻ Hạnh Phúc", "Xin chào! Tôi là người bạn mới của bạn!", "Bảo Chi", "2.9K messages")
    ]
    
    let columns = [
        GridItem(.flexible(), spacing: 12),
        GridItem(.flexible(), spacing: 12)
    ]
    
    var body: some View {
        VStack(spacing: 0) {
            // Header
            HStack(spacing: 16) {
                Button(action: {
                    isPresented = false
                }) {
                    Image(systemName: "chevron.left")
                        .font(.system(size: 20, weight: .medium))
                        .foregroundColor(.primary)
                }
                
                Spacer()
                
                Text("Discover AIs")
                    .font(.system(size: 17, weight: .semibold))
                
                Spacer()
                
                Button(action: {
                    withAnimation(.easeInOut(duration: 0.2)) {
                        isSearchActive = true
                    }
                    DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) {
                        isSearchFocused = true
                    }
                }) {
                    Image(systemName: "magnifyingglass")
                        .font(.system(size: 20))
                        .foregroundColor(isSearchActive ? .messengerBlue : .primary)
                }
                
                Button(action: {
                    showCreateAI = true
                }) {
                    Image(systemName: "plus")
                        .font(.system(size: 20, weight: .medium))
                        .foregroundColor(.primary)
                }
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 12)
            .background(Color.white)
            
            if isSearchActive {
                // Search bar
                HStack(spacing: 12) {
                    HStack(spacing: 8) {
                        Image(systemName: "magnifyingglass")
                            .foregroundColor(.gray)
                            .font(.system(size: 16))
                        
                        TextField("Search", text: $searchText)
                            .font(.system(size: 16))
                            .focused($isSearchFocused)
                    }
                    .padding(.horizontal, 12)
                    .padding(.vertical, 10)
                    .background(
                        RoundedRectangle(cornerRadius: 10)
                            .fill(Color.gray.opacity(0.12))
                    )
                    
                    Button("Cancel") {
                        withAnimation(.easeInOut(duration: 0.2)) {
                            isSearchActive = false
                            searchText = ""
                        }
                    }
                    .font(.system(size: 17))
                    .foregroundColor(.messengerBlue)
                }
                .padding(.horizontal, 16)
                .padding(.vertical, 12)
                .background(Color.white)
                
                // Search results
                ScrollView {
                    VStack(alignment: .leading, spacing: 0) {
                        Text("Suggested")
                            .font(.system(size: 14, weight: .medium))
                            .foregroundColor(.gray)
                            .padding(.horizontal, 16)
                            .padding(.top, 16)
                            .padding(.bottom, 12)
                        
                        ForEach(0..<suggestedAIs.count, id: \.self) { index in
                            SearchAIRow(
                                name: suggestedAIs[index].0,
                                description: suggestedAIs[index].1,
                                creator: suggestedAIs[index].2,
                                messages: suggestedAIs[index].3
                            )
                        }
                    }
                }
                .background(Color.white)
            } else {
                // Category tabs
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 24) {
                        ForEach(categories, id: \.self) { category in
                            Button(action: {
                                selectedCategory = category
                            }) {
                                Text(category)
                                    .font(.system(size: 15, weight: selectedCategory == category ? .semibold : .regular))
                                    .foregroundColor(selectedCategory == category ? .primary : .gray)
                            }
                        }
                    }
                    .padding(.horizontal, 16)
                }
                .padding(.vertical, 12)
                .background(Color.white)
                
                // AI profiles grid
                ScrollView {
                    LazyVGrid(columns: columns, spacing: 12) {
                        ForEach(0..<aiProfiles.count, id: \.self) { index in
                            Button(action: {
                                selectedAI = aiProfiles[index]
                                showAIChat = true
                            }) {
                                AIProfileCard(
                                    name: aiProfiles[index].0,
                                    messages: aiProfiles[index].1,
                                    colorIndex: aiProfiles[index].2
                                )
                            }
                            .buttonStyle(PlainButtonStyle())
                        }
                    }
                    .padding(.horizontal, 12)
                    .padding(.top, 8)
                }
                .background(Color.white)
            }
        }
        .background(Color.white)
        .fullScreenCover(isPresented: $showCreateAI) {
            CreateAIView(
                isPresented: $showCreateAI,
                onDismissToHome: {
                    // Dismiss DiscoverAIsView and continue chain to home
                    var transaction = Transaction()
                    transaction.disablesAnimations = true
                    withTransaction(transaction) {
                        isPresented = false
                        onDismissToHome?()
                    }
                },
                onCreateAIComplete: { aiName, welcomeMessage in
                    // Just pass data up, HeaderView handles dismiss
                    onCreateAIComplete?(aiName, welcomeMessage)
                }
            )
        }
        .fullScreenCover(isPresented: $showAIChat) {
            AIChatView(
                aiName: selectedAI?.0 ?? "AI",
                aiCreator: "Trương Thị Tình",
                isPresented: $showAIChat
            )
        }
    }
}

struct SearchAIRow: View {
    let name: String
    let description: String
    let creator: String
    let messages: String
    
    var body: some View {
        HStack(alignment: .top, spacing: 12) {
            // Avatar
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
                Text(name)
                    .font(.system(size: 16, weight: .semibold))
                    .foregroundColor(.primary)
                
                Text(description)
                    .font(.system(size: 14))
                    .foregroundColor(.gray)
                    .lineLimit(3)
                
                Text("By \(creator) • \(messages)")
                    .font(.system(size: 13))
                    .foregroundColor(.gray)
            }
            
            Spacer()
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 10)
    }
}

struct AIProfileCard: View {
    let name: String
    let messages: String
    let colorIndex: Int
    
    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            // Profile image
            ZStack(alignment: .bottomLeading) {
                RoundedRectangle(cornerRadius: 12)
                    .fill(gradientFor(index: colorIndex))
                    .aspectRatio(0.85, contentMode: .fit)
                    .overlay(
                        Image(systemName: iconFor(index: colorIndex))
                            .font(.system(size: 50))
                            .foregroundColor(.white.opacity(0.4))
                    )
                
                // Name and messages overlay
                VStack(alignment: .leading, spacing: 2) {
                    Text(name)
                        .font(.system(size: 14, weight: .semibold))
                        .foregroundColor(.white)
                        .lineLimit(1)
                    
                    Text(messages)
                        .font(.system(size: 12))
                        .foregroundColor(.white.opacity(0.8))
                }
                .padding(10)
                .frame(maxWidth: .infinity, alignment: .leading)
                .background(
                    LinearGradient(
                        colors: [.clear, .black.opacity(0.6)],
                        startPoint: .top,
                        endPoint: .bottom
                    )
                )
            }
            .clipShape(RoundedRectangle(cornerRadius: 12))
        }
    }
    
    private func gradientFor(index: Int) -> LinearGradient {
        let gradients: [[Color]] = [
            [Color(red: 0.4, green: 0.5, blue: 0.7), Color(red: 0.3, green: 0.4, blue: 0.6)],
            [Color(red: 0.9, green: 0.7, blue: 0.5), Color(red: 0.8, green: 0.6, blue: 0.4)],
            [Color(red: 0.5, green: 0.4, blue: 0.8), Color(red: 0.4, green: 0.3, blue: 0.7)],
            [Color(red: 0.6, green: 0.8, blue: 0.9), Color(red: 0.5, green: 0.7, blue: 0.8)],
            [Color(red: 0.3, green: 0.3, blue: 0.4), Color(red: 0.2, green: 0.2, blue: 0.3)],
            [Color(red: 0.8, green: 0.3, blue: 0.3), Color(red: 0.7, green: 0.2, blue: 0.2)]
        ]
        let colors = gradients[index % gradients.count]
        return LinearGradient(colors: colors, startPoint: .topLeading, endPoint: .bottomTrailing)
    }
    
    private func iconFor(index: Int) -> String {
        let icons = ["person.fill", "face.smiling", "brain.head.profile", "sparkles", "person.crop.circle", "gamecontroller.fill"]
        return icons[index % icons.count]
    }
}

#Preview {
    DiscoverAIsView(isPresented: .constant(true))
}
