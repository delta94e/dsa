import SwiftUI

struct SearchView: View {
    @Binding var isPresented: Bool
    var searchAnimation: Namespace.ID
    @State private var searchText = ""
    @FocusState private var isSearchFocused: Bool
    @State private var scrollOffset: CGFloat = 0
    @State private var selectedFilter = "People"
    @State private var isLoading = false
    @State private var showMorePeople = false
    
    let filters = ["People", "Messages", "Groups", "Channels"]
    
    let suggestions = [
        ("🪄", "Imagine a diamond ring"),
        ("💕", "Teach me love language"),
        ("🎮", "Top 2024 video games so far"),
        ("🎬", "Make me a moving"),
        ("📸", "Edit my photo"),
        ("🎵", "Write me a song"),
        ("📝", "Help me write"),
        ("🌍", "Plan my trip")
    ]
    
    let recentSearches = [
        "Hảo Nguyễn", "Trần Trọng Tín", "Ổ Rắn Nhỏ Kịch Độc", 
        "Dang Quang", "Ái Vy", "Shop tài khoản AI", 
        "Loc Nguyen", "Đạt Duy Lê", "Khơi vị yêu thương", "Trọng Đại"
    ]
    
    var body: some View {
        ZStack {
            // Main search content
            mainSearchContent
            
            // More people overlay with slide animation
            if showMorePeople {
                MorePeopleView(isPresented: $showMorePeople, searchText: searchText)
                    .transition(.move(edge: .trailing))
                    .zIndex(1)
            }
        }
        .animation(.easeInOut(duration: 0.25), value: showMorePeople)
    }
    
    private var mainSearchContent: some View {
        VStack(spacing: 0) {
            // Search header with matched geometry
            HStack(spacing: 12) {
                // Back button
                Button(action: {
                    withAnimation(.easeOut(duration: 0.18)) {
                        isPresented = false
                    }
                }) {
                    Image(systemName: "chevron.left")
                        .font(.system(size: 20, weight: .medium))
                        .foregroundColor(.messengerBlue)
                }
                
                // Search input - matched with main search bar
                HStack(spacing: 8) {
                    // Meta AI icon
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
                    
                    TextField("Ask Meta AI or Search", text: $searchText)
                        .font(.system(size: 16))
                        .focused($isSearchFocused)
                        .onChange(of: searchText) { oldValue, newValue in
                            if !newValue.isEmpty {
                                isLoading = true
                                // Simulate loading
                                DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) {
                                    isLoading = false
                                }
                            }
                        }
                }
                .padding(.horizontal, 12)
                .padding(.vertical, 10)
                .background(Color.searchBarBackground)
                .cornerRadius(20)
                .matchedGeometryEffect(id: "searchBar", in: searchAnimation)
                
                // Send button
                Button(action: {}) {
                    Image(systemName: "paperplane.fill")
                        .font(.system(size: 20))
                        .foregroundColor(.messengerBlue)
                }
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 12)
            .background(Color.white)
            
            // Show filter tabs when typing
            if !searchText.isEmpty {
                // Filter tabs
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 8) {
                        ForEach(filters, id: \.self) { filter in
                            FilterTab(title: filter, isSelected: selectedFilter == filter) {
                                selectedFilter = filter
                            }
                        }
                    }
                    .padding(.horizontal, 16)
                    .padding(.vertical, 10)
                }
                .background(Color.white)
                
                // Loading indicator
                if isLoading {
                    VStack {
                        ProgressView()
                            .scaleEffect(1.2)
                            .padding(.top, 40)
                        Spacer()
                    }
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
                    .background(Color.white)
                } else {
                    // Search results based on selected filter
                    ScrollView {
                        VStack(alignment: .leading, spacing: 0) {
                            if selectedFilter == "People" {
                                // People results
                                VStack(spacing: 0) {
                                    PersonResultRow(
                                        name: "Mai Đạt",
                                        subtitle: "trong group \(searchText.uppercased()), tại ảnh kêu k cần kinh nghiệm · Oct 25, 2018",
                                        highlightText: searchText.uppercased(),
                                        isOnline: true
                                    )
                                    PersonResultRow(
                                        name: "Minh",
                                        subtitle: "nếu học thấy trang hồi này a gửi và \(searchText.uppercased()), theodinproject là ngon · Aug 22, 2018",
                                        highlightText: searchText.uppercased()
                                    )
                                }
                                
                                // More people section
                                SearchSectionHeader(title: "More people", showSeeMore: true) {
                                    showMorePeople = true
                                }
                                
                                VStack(spacing: 0) {
                                    PersonResultRow(
                                        name: "\(searchText.uppercased()).",
                                        subtitle: "@\(searchText).845680",
                                        avatarText: "F.C.C."
                                    )
                                    PersonResultRow(
                                        name: "Phụ Tùng F.C.C Exedy (Phụ Tùng Xe...",
                                        subtitle: "Works at Cty Honda Vĩnh Phúc"
                                    )
                                    PersonResultRow(
                                        name: "\(searchText.uppercased()) Christine",
                                        subtitle: "@christinefast.2025"
                                    )
                                    PersonResultRow(
                                        name: "\(searchText.capitalized) \(searchText.capitalized)",
                                        subtitle: "Works at Ayala Malls, Circuit Makati"
                                    )
                                    PersonResultRow(
                                        name: "LIGA \(searchText.uppercased()) TULUM QUINTANA ROO",
                                        subtitle: "@liga\(searchText)tulumquintanaroo"
                                    )
                                }
                                
                                // Pages section
                                SearchSectionHeader(title: "Pages", showSeeMore: true)
                                
                                VStack(spacing: 0) {
                                    PageResultRow(
                                        name: "\(searchText.uppercased()) Angkor by Avani",
                                        subtitle: "Hotel resort",
                                        isVerified: true
                                    )
                                }
                                
                            } else if selectedFilter == "Messages" {
                                // Messages results
                                VStack(spacing: 0) {
                                    MessageResultRow(
                                        name: "Những coder chăm chỉ",
                                        message: "...m mấy cái này dễ hiểu hơn a a do trên \(searchText.uppercased()) nó là English nữa nên đôi khi hơi khó hiểu",
                                        date: "May 6, 2019",
                                        highlightText: searchText.uppercased()
                                    )
                                    MessageResultRow(
                                        name: "Mai Đạt",
                                        message: "trong group \(searchText.uppercased()), tại anh kêu k cần kinh nghiệm",
                                        date: "Oct 25, 2018",
                                        highlightText: searchText.uppercased(),
                                        isOnline: true
                                    )
                                }
                            } else {
                                // Groups/Channels placeholder
                                VStack {
                                    Text("No \(selectedFilter.lowercased()) found for \"\(searchText)\"")
                                        .font(.system(size: 15))
                                        .foregroundColor(.gray)
                                        .padding(.top, 40)
                                }
                            }
                        }
                    }
                    .background(Color.white)
                }
            } else {
                Divider()
                
                ScrollView {
                    VStack(alignment: .leading, spacing: 20) {
                        // Ask Meta AI section
                        Text("Ask Meta AI")
                            .font(.system(size: 15, weight: .semibold))
                            .foregroundColor(.primary)
                            .padding(.horizontal, 16)
                            .padding(.top, 12)
                        
                        // Auto-scrolling suggestions
                        VStack(spacing: 4) {
                            MarqueeView {
                                HStack(spacing: 8) {
                                    ForEach(0..<suggestions.count, id: \.self) { i in
                                        SuggestionChip(emoji: suggestions[i].0, text: suggestions[i].1)
                                    }
                                }
                            }
                            
                            MarqueeView(delay: 0.5) {
                                HStack(spacing: 8) {
                                    ForEach((0..<suggestions.count).reversed(), id: \.self) { i in
                                        SuggestionChip(emoji: suggestions[i].0, text: suggestions[i].1)
                                    }
                                }
                            }
                        }
                        
                        // Recent searches
                        HStack {
                            Text("Recent searches")
                                .font(.system(size: 15, weight: .semibold))
                                .foregroundColor(.primary)
                            Spacer()
                            Button("Edit") {}
                                .font(.system(size: 15))
                                .foregroundColor(.messengerBlue)
                        }
                        .padding(.horizontal, 16)
                        
                        // Recent searches grid
                        LazyVGrid(columns: Array(repeating: GridItem(.flexible(), spacing: 12), count: 5), spacing: 16) {
                            ForEach(0..<10, id: \.self) { i in
                                VStack(spacing: 6) {
                                    Circle()
                                        .fill(
                                            LinearGradient(
                                                colors: [.blue.opacity(0.3), .purple.opacity(0.3)],
                                                startPoint: .topLeading,
                                                endPoint: .bottomTrailing
                                            )
                                        )
                                        .frame(width: 56, height: 56)
                                        .overlay(
                                            Image(systemName: "person.fill")
                                                .foregroundColor(.white.opacity(0.8))
                                                .font(.system(size: 24))
                                        )
                                    
                                    Text(recentSearches[i])
                                        .font(.system(size: 11))
                                        .foregroundColor(.primary)
                                        .lineLimit(2)
                                        .multilineTextAlignment(.center)
                                        .frame(width: 60)
                                }
                            }
                        }
                        .padding(.horizontal, 16)
                        
                        // Suggested section
                        Text("Suggested")
                            .font(.system(size: 15, weight: .semibold))
                            .foregroundColor(.primary)
                            .padding(.horizontal, 16)
                    }
                }
            }
            
            Spacer()
        }
        .background(Color.white)
        .onAppear {
            isSearchFocused = true
        }
    }
}

// Filter tab button
struct FilterTab: View {
    let title: String
    let isSelected: Bool
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            Text(title)
                .font(.system(size: 14, weight: .medium))
                .foregroundColor(isSelected ? .white : .primary)
                .padding(.horizontal, 16)
                .padding(.vertical, 8)
                .background(
                    Capsule()
                        .fill(isSelected ? Color.messengerBlue : Color.searchBarBackground)
                )
        }
    }
}

// Search section header
struct SearchSectionHeader: View {
    let title: String
    var showSeeMore: Bool = false
    var onSeeMore: (() -> Void)? = nil
    
    var body: some View {
        HStack {
            Text(title)
                .font(.system(size: 14, weight: .medium))
                .foregroundColor(.gray)
            Spacer()
            if showSeeMore {
                Button("See more") {
                    onSeeMore?()
                }
                .font(.system(size: 14))
                .foregroundColor(.messengerBlue)
            }
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 12)
    }
}

// Person result row
struct PersonResultRow: View {
    let name: String
    let subtitle: String
    var highlightText: String = ""
    var isOnline: Bool = false
    var avatarText: String? = nil
    
    var body: some View {
        HStack(spacing: 12) {
            // Avatar
            ZStack(alignment: .bottomTrailing) {
                if let text = avatarText {
                    // Text avatar
                    Circle()
                        .fill(Color.blue)
                        .frame(width: 44, height: 44)
                        .overlay(
                            Text(text)
                                .font(.system(size: 10, weight: .bold))
                                .foregroundColor(.white)
                        )
                } else {
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
                                .font(.system(size: 20))
                        )
                }
                
                if isOnline {
                    Circle()
                        .fill(Color.green)
                        .frame(width: 12, height: 12)
                        .overlay(
                            Circle()
                                .stroke(Color.white, lineWidth: 2)
                        )
                }
            }
            
            VStack(alignment: .leading, spacing: 2) {
                Text(attributedName)
                    .font(.system(size: 15, weight: .semibold))
                    .lineLimit(1)
                
                Text(attributedSubtitle)
                    .font(.system(size: 13))
                    .foregroundColor(.gray)
                    .lineLimit(2)
            }
            
            Spacer()
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 10)
    }
    
    private var attributedName: AttributedString {
        var result = AttributedString(name)
        if !highlightText.isEmpty, let range = result.range(of: highlightText, options: .caseInsensitive) {
            result[range].foregroundColor = .primary
            result[range].font = .system(size: 15, weight: .bold)
        }
        return result
    }
    
    private var attributedSubtitle: AttributedString {
        var result = AttributedString(subtitle)
        if !highlightText.isEmpty, let range = result.range(of: highlightText, options: .caseInsensitive) {
            result[range].foregroundColor = .primary
            result[range].font = .system(size: 13, weight: .bold)
        }
        return result
    }
}

// Page result row
struct PageResultRow: View {
    let name: String
    let subtitle: String
    var isVerified: Bool = false
    
    var body: some View {
        HStack(spacing: 12) {
            // Page avatar
            RoundedRectangle(cornerRadius: 8)
                .fill(Color.gray.opacity(0.2))
                .frame(width: 44, height: 44)
                .overlay(
                    Text("FCC")
                        .font(.system(size: 12, weight: .bold))
                        .foregroundColor(.gray)
                )
            
            VStack(alignment: .leading, spacing: 2) {
                HStack(spacing: 4) {
                    Text(name)
                        .font(.system(size: 15, weight: .semibold))
                        .lineLimit(1)
                    
                    if isVerified {
                        Image(systemName: "checkmark.seal.fill")
                            .font(.system(size: 14))
                            .foregroundColor(.messengerBlue)
                    }
                }
                
                Text(subtitle)
                    .font(.system(size: 13))
                    .foregroundColor(.gray)
            }
            
            Spacer()
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 10)
    }
}

// AI Suggestion row
struct AISuggestionRow: View {
    let text: String
    
    var body: some View {
        HStack(spacing: 12) {
            // Gradient ring icon
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
                    .frame(width: 36, height: 36)
            }
            
            Text(text)
                .font(.system(size: 16))
                .foregroundColor(.primary)
            
            Spacer()
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 10)
    }
}

// Message result row
struct MessageResultRow: View {
    let name: String
    let message: String
    let date: String
    let highlightText: String
    var isOnline: Bool = false
    
    var body: some View {
        HStack(alignment: .top, spacing: 12) {
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
                            .font(.system(size: 20))
                    )
                
                if isOnline {
                    Circle()
                        .fill(Color.green)
                        .frame(width: 12, height: 12)
                        .overlay(
                            Circle()
                                .stroke(Color.white, lineWidth: 2)
                        )
                }
            }
            
            VStack(alignment: .leading, spacing: 4) {
                Text(name)
                    .font(.system(size: 15, weight: .semibold))
                    .foregroundColor(.primary)
                
                Text(attributedMessage)
                    .font(.system(size: 14))
                    .foregroundColor(.gray)
                    .lineLimit(2)
                
                Text(date)
                    .font(.system(size: 12))
                    .foregroundColor(.gray)
            }
            
            Spacer()
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 10)
    }
    
    private var attributedMessage: AttributedString {
        var result = AttributedString(message)
        if let range = result.range(of: highlightText, options: .caseInsensitive) {
            result[range].foregroundColor = .primary
            result[range].font = .system(size: 14, weight: .bold)
        }
        return result
    }
}

// Marquee view for auto-scrolling content
struct MarqueeView<Content: View>: View {
    let content: Content
    let delay: Double
    @State private var offset: CGFloat = 0
    @State private var contentWidth: CGFloat = 0
    
    init(delay: Double = 0, @ViewBuilder content: () -> Content) {
        self.content = content()
        self.delay = delay
    }
    
    var body: some View {
        GeometryReader { geo in
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 0) {
                    content
                        .background(GeometryReader { contentGeo in
                            Color.clear.onAppear {
                                contentWidth = contentGeo.size.width
                            }
                        })
                }
                .offset(x: offset)
            }
            .disabled(true)
            .onAppear {
                startScrolling(containerWidth: geo.size.width)
            }
        }
        .frame(height: 40)
        .clipped()
    }
    
    private func startScrolling(containerWidth: CGFloat) {
        DispatchQueue.main.asyncAfter(deadline: .now() + delay) {
            withAnimation(.linear(duration: 60).repeatForever(autoreverses: false)) {
                offset = -(contentWidth - containerWidth + 50)
            }
        }
    }
}

struct SuggestionChip: View {
    let emoji: String
    let text: String
    
    var body: some View {
        HStack(spacing: 6) {
            Text(emoji)
                .font(.system(size: 14))
            Text(text)
                .font(.system(size: 14))
                .foregroundColor(.primary)
        }
        .padding(.horizontal, 12)
        .padding(.vertical, 8)
        .background(Color.searchBarBackground)
        .cornerRadius(16)
    }
}

#Preview {
    @Previewable @Namespace var previewNamespace
    SearchView(isPresented: .constant(true), searchAnimation: previewNamespace)
}
