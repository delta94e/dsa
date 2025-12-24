import SwiftUI

struct MorePeopleView: View {
    @Binding var isPresented: Bool
    let searchText: String
    @State private var selectedFilters: Set<String> = []
    
    let filters = ["City", "Friends", "Education"]
    
    let people = [
        ("F.C.C.", "@fcc.845680", "F.C.C."),
        ("F Cc", "@f.cc.130722", nil),
        ("LIGA FCC TULUM QUINTANA ROO", "@ligafcctulumquintanaroo", nil),
        ("Fcc Fcc", "Works at Ayala Malls, Circuit Makati", nil),
        ("Saniya FCC", "@s.roy.828778", nil),
        ("FCC Christine", "@christinefast.2025", nil),
        ("Fcc Đdd", nil, nil),
        ("FCC Batch 74-75", "@fcc.batch.74.75", nil),
        ("Xám Fcc", "Lives in Tân Uyên", nil),
        ("Phụ Tùng F.C.C Exedy (Phụ Tùng Xe...", "Works at Cty Honda Vĩnh Phúc", nil)
    ]
    
    var body: some View {
        VStack(spacing: 0) {
            // Header
            HStack {
                Button(action: {
                    withAnimation(.easeOut(duration: 0.2)) {
                        isPresented = false
                    }
                }) {
                    Image(systemName: "chevron.left")
                        .font(.system(size: 20, weight: .medium))
                        .foregroundColor(.primary)
                }
                
                Spacer()
                
                Text("More people")
                    .font(.system(size: 17, weight: .semibold))
                
                Spacer()
                
                // Placeholder for symmetry
                Image(systemName: "chevron.left")
                    .font(.system(size: 20, weight: .medium))
                    .foregroundColor(.clear)
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 12)
            .background(Color.white)
            
            // Filter chips
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 8) {
                    ForEach(filters, id: \.self) { filter in
                        FilterChip(
                            title: filter,
                            isSelected: selectedFilters.contains(filter)
                        ) {
                            if selectedFilters.contains(filter) {
                                selectedFilters.remove(filter)
                            } else {
                                selectedFilters.insert(filter)
                            }
                        }
                    }
                }
                .padding(.horizontal, 16)
                .padding(.vertical, 10)
            }
            .background(Color.white)
            
            Divider()
            
            // People list
            ScrollView {
                LazyVStack(spacing: 0) {
                    ForEach(0..<people.count, id: \.self) { index in
                        MorePeopleRow(
                            name: people[index].0,
                            subtitle: people[index].1,
                            avatarText: people[index].2
                        )
                    }
                }
            }
            .background(Color.white)
        }
        .background(Color.white)
    }
}

// Filter chip with dropdown arrow
struct FilterChip: View {
    let title: String
    let isSelected: Bool
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            HStack(spacing: 4) {
                Text(title)
                    .font(.system(size: 14, weight: .medium))
                Image(systemName: "chevron.down")
                    .font(.system(size: 10, weight: .medium))
            }
            .foregroundColor(isSelected ? .white : .primary)
            .padding(.horizontal, 12)
            .padding(.vertical, 8)
            .background(
                Capsule()
                    .fill(isSelected ? Color.messengerBlue : Color.searchBarBackground)
            )
        }
    }
}

// More people row
struct MorePeopleRow: View {
    let name: String
    let subtitle: String?
    let avatarText: String?
    
    var body: some View {
        HStack(spacing: 12) {
            // Avatar
            if let text = avatarText {
                Circle()
                    .fill(Color.blue)
                    .frame(width: 50, height: 50)
                    .overlay(
                        Text(text)
                            .font(.system(size: 11, weight: .bold))
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
                    .frame(width: 50, height: 50)
                    .overlay(
                        Image(systemName: "person.fill")
                            .foregroundColor(.white.opacity(0.8))
                            .font(.system(size: 22))
                    )
            }
            
            VStack(alignment: .leading, spacing: 2) {
                Text(name)
                    .font(.system(size: 16, weight: .semibold))
                    .foregroundColor(.primary)
                    .lineLimit(1)
                
                if let subtitle = subtitle {
                    Text(subtitle)
                        .font(.system(size: 14))
                        .foregroundColor(.gray)
                        .lineLimit(1)
                }
            }
            
            Spacer()
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 12)
    }
}

#Preview {
    MorePeopleView(isPresented: .constant(true), searchText: "fcc")
}
