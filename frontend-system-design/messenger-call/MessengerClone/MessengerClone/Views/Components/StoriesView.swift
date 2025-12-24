import SwiftUI

struct StoriesView: View {
    let stories: [Story]
    @State private var selectedStory: Story?
    
    var body: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 8) {
                ForEach(stories) { story in
                    StoryItemView(story: story) {
                        if story.hasActiveStory && !story.isCreateStory {
                            selectedStory = story
                        }
                    }
                }
            }
            .padding(.horizontal, 16)
        }
        .padding(.vertical, 8)
        .fullScreenCover(item: $selectedStory) { story in
            StoryViewerView(story: story, isPresented: Binding(
                get: { selectedStory != nil },
                set: { if !$0 { selectedStory = nil } }
            ))
        }
    }
}

#Preview {
    StoriesView(stories: Story.sampleStories)
}
