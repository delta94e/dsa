import SwiftUI

struct StoryItemView: View {
    let story: Story
    var onTap: (() -> Void)? = nil
    
    var body: some View {
        Button(action: {
            onTap?()
        }) {
            storyContent
        }
        .buttonStyle(PlainButtonStyle())
    }
    
    private var storyContent: some View {
        VStack(spacing: 6) {
            ZStack {
                // Avatar content
                ZStack(alignment: .bottomTrailing) {
                    // Main avatar container
                    ZStack {
                        // White gap between avatar and border
                        if story.hasActiveStory {
                            Circle()
                                .fill(Color.white)
                                .frame(width: AppConstants.storyAvatarSize + 8, height: AppConstants.storyAvatarSize + 8)
                        }
                        
                        // Gradient border for active stories
                        if story.hasActiveStory {
                            Circle()
                                .strokeBorder(
                                    LinearGradient(
                                        colors: [
                                            Color(red: 0.0, green: 0.6, blue: 1.0),
                                            Color(red: 0.5, green: 0.3, blue: 1.0),
                                            Color(red: 1.0, green: 0.3, blue: 0.5)
                                        ],
                                        startPoint: .topLeading,
                                        endPoint: .bottomTrailing
                                    ),
                                    lineWidth: 2.5
                                )
                                .frame(width: AppConstants.storyAvatarSize + 8, height: AppConstants.storyAvatarSize + 8)
                        }
                        
                        // Avatar placeholder
                        Circle()
                            .fill(
                                LinearGradient(
                                    colors: story.isCreateStory 
                                        ? [.gray.opacity(0.2), .gray.opacity(0.3)]
                                        : [Color(red: 0.7, green: 0.8, blue: 0.9), Color(red: 0.8, green: 0.7, blue: 0.9)],
                                    startPoint: .topLeading,
                                    endPoint: .bottomTrailing
                                )
                            )
                            .frame(width: AppConstants.storyAvatarSize, height: AppConstants.storyAvatarSize)
                        
                        // Icon or image
                        if story.isCreateStory {
                            Image(systemName: "camera.fill")
                                .font(.system(size: 24))
                                .foregroundColor(.gray)
                        } else {
                            Image(systemName: "person.fill")
                                .font(.system(size: 30))
                                .foregroundColor(.white.opacity(0.9))
                        }
                    }
                    
                    // Plus button for create story
                    if story.isCreateStory {
                        ZStack {
                            Circle()
                                .fill(Color.messengerBlue)
                                .frame(width: 24, height: 24)
                            Circle()
                                .stroke(Color.white, lineWidth: 2)
                                .frame(width: 24, height: 24)
                            Image(systemName: "plus")
                                .font(.system(size: 12, weight: .bold))
                                .foregroundColor(.white)
                        }
                        .offset(x: 2, y: 2)
                    }
                    
                    // Online indicator
                    if story.isOnline && !story.isCreateStory {
                        ZStack {
                            Circle()
                                .fill(Color.white)
                                .frame(width: 18, height: 18)
                            Circle()
                                .fill(Color.green)
                                .frame(width: 14, height: 14)
                        }
                        .offset(x: 2, y: 2)
                    }
                }
                .frame(width: AppConstants.storyAvatarSize + 12, height: AppConstants.storyAvatarSize + 12)
                
                // Status text bubble - positioned at top center, overlapping avatar
                if let statusText = story.statusText {
                    VStack(alignment: .center, spacing: 2) {
                        // Main bubble
                        Text(statusText)
                            .font(.system(size: 9))
                            .foregroundColor(.primary)
                            .lineLimit(2)
                            .fixedSize(horizontal: false, vertical: true)
                            .padding(.horizontal, 8)
                            .padding(.vertical, 5)
                            .background(
                                RoundedRectangle(cornerRadius: 10)
                                    .fill(Color.white)
                                    .shadow(color: .black.opacity(0.15), radius: 3, x: 0, y: 1)
                            )
                        
                        // Thought bubble circles - only for Create Story
                        if story.isCreateStory {
                            HStack(spacing: 2) {
                                Circle()
                                    .fill(Color.white)
                                    .frame(width: 6, height: 6)
                                    .shadow(color: .black.opacity(0.1), radius: 1, x: 0, y: 0.5)
                                Circle()
                                    .fill(Color.white)
                                    .frame(width: 4, height: 4)
                                    .shadow(color: .black.opacity(0.1), radius: 1, x: 0, y: 0.5)
                            }
                        }
                    }
                    .offset(x: 0, y: -28)
                }
            }
            .frame(height: AppConstants.storyAvatarSize + 30)
            
            // Name
            Text(story.name)
                .font(.system(size: 12))
                .foregroundColor(.primary)
                .lineLimit(1)
                .frame(width: 75)
        }
    }
}

#Preview {
    HStack(spacing: 8) {
        StoryItemView(story: Story.sampleStories[0])
        StoryItemView(story: Story.sampleStories[1])
        StoryItemView(story: Story.sampleStories[2])
    }
    .padding()
}
