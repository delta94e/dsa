import Foundation

struct Story: Identifiable {
    let id = UUID()
    let name: String
    let avatarUrl: String
    let isCreateStory: Bool
    let hasActiveStory: Bool
    let isOnline: Bool
    let statusText: String?
    
    init(name: String, avatarUrl: String, isCreateStory: Bool = false, hasActiveStory: Bool = true, isOnline: Bool = false, statusText: String? = nil) {
        self.name = name
        self.avatarUrl = avatarUrl
        self.isCreateStory = isCreateStory
        self.hasActiveStory = hasActiveStory
        self.isOnline = isOnline
        self.statusText = statusText
    }
}

// Sample data
extension Story {
    static let sampleStories: [Story] = [
        Story(name: "Create story", avatarUrl: "camera.fill", isCreateStory: true, hasActiveStory: false, isOnline: false, statusText: "Currently\nwatching 📺"),
        Story(name: "Huy", avatarUrl: "person.crop.circle.fill", hasActiveStory: true, isOnline: true, statusText: "🎵 Đau (Lofi)\nKProx, Hứ..."),
        Story(name: "Vinh", avatarUrl: "person.crop.circle", hasActiveStory: true, isOnline: true),
        Story(name: "Sáng", avatarUrl: "person.crop.circle.fill", hasActiveStory: true, isOnline: false)
    ]
}
