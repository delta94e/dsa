import SwiftUI

struct CreateStoryView: View {
    @Binding var isPresented: Bool
    @State private var showAlbumPicker = false
    @State private var selectedAlbum = "Recents"
    
    let photoCount = 20
    
    var body: some View {
        VStack(spacing: 0) {
            // Header
            HStack {
                Button("Cancel") {
                    isPresented = false
                }
                .font(.system(size: 17))
                .foregroundColor(.messengerBlue)
                
                Spacer()
                
                // Album dropdown
                Button(action: {
                    showAlbumPicker = true
                }) {
                    HStack(spacing: 4) {
                        Text(selectedAlbum)
                            .font(.system(size: 17, weight: .semibold))
                            .foregroundColor(.primary)
                        Image(systemName: "chevron.down")
                            .font(.system(size: 12, weight: .semibold))
                            .foregroundColor(.primary)
                    }
                }
                
                Spacer()
                
                Button("Albums") {
                    showAlbumPicker = true
                }
                .font(.system(size: 17))
                .foregroundColor(.messengerBlue)
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 16)
            .background(Color.white)
            
            // Photo grid
            ScrollView {
                LazyVGrid(columns: [
                    GridItem(.flexible(), spacing: 2),
                    GridItem(.flexible(), spacing: 2),
                    GridItem(.flexible(), spacing: 2)
                ], spacing: 2) {
                    // Camera cell
                    CameraCell()
                    
                    // Photo cells
                    ForEach(0..<photoCount, id: \.self) { index in
                        PhotoCell(colorIndex: index)
                    }
                }
            }
            .background(Color.white)
            
            Divider()
            
            // Bottom menu section
            VStack(spacing: 0) {
                // Menu items
                MenuRow(icon: "person.2.fill", title: "Group chat")
                MenuRow(icon: "megaphone.fill", title: "Messaging ads")
                MenuRow(icon: "sparkles", title: "Chat with AIs")
            }
            .background(Color.white)
        }
        .background(Color.white)
        .sheet(isPresented: $showAlbumPicker) {
            AlbumPickerView(selectedAlbum: $selectedAlbum, isPresented: $showAlbumPicker)
        }
    }
}

// Camera cell
struct CameraCell: View {
    var body: some View {
        Rectangle()
            .fill(Color.gray.opacity(0.1))
            .aspectRatio(1, contentMode: .fit)
            .overlay(
                VStack(spacing: 8) {
                    ZStack {
                        Circle()
                            .stroke(Color.primary, lineWidth: 2)
                            .frame(width: 50, height: 50)
                        Image(systemName: "camera.fill")
                            .font(.system(size: 22))
                            .foregroundColor(.primary)
                    }
                    Text("Camera")
                        .font(.system(size: 13))
                        .foregroundColor(.primary)
                }
            )
    }
}

// Photo cell placeholder
struct PhotoCell: View {
    let colorIndex: Int
    
    var body: some View {
        Rectangle()
            .fill(gradientFor(index: colorIndex))
            .aspectRatio(1, contentMode: .fit)
    }
    
    private func gradientFor(index: Int) -> LinearGradient {
        let gradients: [[Color]] = [
            [.blue.opacity(0.3), .purple.opacity(0.4)],
            [.orange.opacity(0.3), .red.opacity(0.4)],
            [.green.opacity(0.3), .teal.opacity(0.4)],
            [.pink.opacity(0.3), .purple.opacity(0.4)],
            [.yellow.opacity(0.3), .orange.opacity(0.4)],
            [.indigo.opacity(0.3), .blue.opacity(0.4)]
        ]
        let colors = gradients[index % gradients.count]
        return LinearGradient(colors: colors, startPoint: .topLeading, endPoint: .bottomTrailing)
    }
}

// Menu row
struct MenuRow: View {
    let icon: String
    let title: String
    
    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: icon)
                .font(.system(size: 18))
                .foregroundColor(.primary)
                .frame(width: 24)
            
            Text(title)
                .font(.system(size: 16))
                .foregroundColor(.primary)
            
            Spacer()
            
            Image(systemName: "chevron.right")
                .font(.system(size: 14))
                .foregroundColor(.gray)
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 12)
    }
}

// Album picker sheet
struct AlbumPickerView: View {
    @Binding var selectedAlbum: String
    @Binding var isPresented: Bool
    
    let albums = [
        ("Recents", 1607),
        ("Favorites", 3),
        ("Videos", 51),
        ("Selfies", 21),
        ("Live Photos", 2),
        ("Portrait", 45)
    ]
    
    let columns = [
        GridItem(.flexible(), spacing: 12),
        GridItem(.flexible(), spacing: 12)
    ]
    
    var body: some View {
        VStack(spacing: 0) {
            // Header
            HStack {
                Button("Cancel") {
                    isPresented = false
                }
                .font(.system(size: 17))
                .foregroundColor(.messengerBlue)
                
                Spacer()
                
                Text("Select album")
                    .font(.system(size: 17, weight: .semibold))
                
                Spacer()
                
                Text("Cancel")
                    .font(.system(size: 17))
                    .foregroundColor(.clear)
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 16)
            .background(Color.white)
            
            Divider()
            
            // Albums grid
            ScrollView {
                LazyVGrid(columns: columns, spacing: 20) {
                    ForEach(0..<albums.count, id: \.self) { index in
                        Button(action: {
                            selectedAlbum = albums[index].0
                            isPresented = false
                        }) {
                            AlbumItem(
                                name: albums[index].0,
                                count: albums[index].1,
                                colorIndex: index
                            )
                        }
                        .buttonStyle(PlainButtonStyle())
                    }
                }
                .padding(.horizontal, 16)
                .padding(.top, 16)
            }
            .background(Color.white)
        }
        .background(Color.white)
    }
}

struct AlbumItem: View {
    let name: String
    let count: Int
    let colorIndex: Int
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            RoundedRectangle(cornerRadius: 8)
                .fill(gradientFor(index: colorIndex))
                .aspectRatio(1, contentMode: .fit)
                .overlay(
                    Image(systemName: iconFor(name: name))
                        .font(.system(size: 40))
                        .foregroundColor(.white.opacity(0.6))
                )
            
            Text(name)
                .font(.system(size: 15, weight: .medium))
                .foregroundColor(.primary)
            
            Text("\(count)")
                .font(.system(size: 13))
                .foregroundColor(.gray)
        }
    }
    
    private func gradientFor(index: Int) -> LinearGradient {
        let gradients: [[Color]] = [
            [.blue.opacity(0.4), .purple.opacity(0.5)],
            [.orange.opacity(0.4), .red.opacity(0.5)],
            [.purple.opacity(0.4), .pink.opacity(0.5)],
            [.pink.opacity(0.4), .orange.opacity(0.5)],
            [.green.opacity(0.4), .teal.opacity(0.5)],
            [.indigo.opacity(0.4), .blue.opacity(0.5)]
        ]
        let colors = gradients[index % gradients.count]
        return LinearGradient(colors: colors, startPoint: .topLeading, endPoint: .bottomTrailing)
    }
    
    private func iconFor(name: String) -> String {
        switch name {
        case "Recents": return "photo.on.rectangle"
        case "Favorites": return "heart.fill"
        case "Videos": return "video.fill"
        case "Selfies": return "person.crop.square"
        case "Live Photos": return "livephoto"
        case "Portrait": return "person.fill"
        default: return "photo"
        }
    }
}

#Preview {
    CreateStoryView(isPresented: .constant(true))
}
