import SwiftUI

struct StoryViewerView: View {
    let story: Story
    @Binding var isPresented: Bool
    @State private var currentIndex = 0
    @State private var progress: CGFloat = 0
    @State private var messageText = ""
    @State private var timer: Timer?
    @State private var startTime: Date?
    @State private var isPaused = false
    @State private var pausedProgress: CGFloat = 0

    let storyCount = 3
    let storyDuration: Double = 5

    var body: some View {
        GeometryReader { geo in
            ZStack {
                // Background image placeholder
                Color.black
                    .ignoresSafeArea()

                // Story image placeholder - changes based on current index
                storyGradient(for: currentIndex)
                    .ignoresSafeArea()

                // Story content placeholder
                VStack {
                    Spacer()
                    Image(systemName: "photo.fill")
                        .font(.system(size: 80))
                        .foregroundColor(.white.opacity(0.3))
                    Text("Story \(currentIndex + 1) of \(storyCount)")
                        .foregroundColor(.white.opacity(0.5))
                    Spacer()
                }

                // Overlay content
                VStack(spacing: 0) {
                    // Progress bars
                    HStack(spacing: 4) {
                        ForEach(0..<storyCount, id: \.self) { index in
                            GeometryReader { barGeo in
                                ZStack(alignment: .leading) {
                                    // Background
                                    Capsule()
                                        .fill(Color.white.opacity(0.3))

                                    // Progress
                                    Capsule()
                                        .fill(Color.white)
                                        .frame(width: barGeo.size.width * progressFor(index: index))
                                }
                            }
                            .frame(height: 2)
                        }
                    }
                    .padding(.horizontal, 12)
                    .padding(.top, 8)

                    // Header
                    HStack(spacing: 12) {
                        // Avatar
                        Circle()
                            .fill(
                                LinearGradient(
                                    colors: [.blue.opacity(0.3), .purple.opacity(0.3)],
                                    startPoint: .topLeading,
                                    endPoint: .bottomTrailing
                                )
                            )
                            .frame(width: 36, height: 36)
                            .overlay(
                                Image(systemName: "person.fill")
                                    .foregroundColor(.white.opacity(0.8))
                                    .font(.system(size: 16))
                            )

                        // Name and time
                        HStack(spacing: 6) {
                            Text(story.name)
                                .font(.system(size: 14, weight: .semibold))
                                .foregroundColor(.white)

                            Text("12h")
                                .font(.system(size: 13))
                                .foregroundColor(.white.opacity(0.7))
                        }

                        Spacer()

                        // Action buttons
                        HStack(spacing: 16) {
                            Button(action: {}) {
                                Image(systemName: "ellipsis")
                                    .font(.system(size: 18))
                                    .foregroundColor(.white)
                            }

                            Button(action: {}) {
                                Image(systemName: "speaker.wave.2.fill")
                                    .font(.system(size: 18))
                                    .foregroundColor(.white)
                            }

                            Button(action: {
                                stopTimer()
                                isPresented = false
                            }) {
                                Image(systemName: "xmark")
                                    .font(.system(size: 18, weight: .medium))
                                    .foregroundColor(.white)
                            }
                        }
                    }
                    .padding(.horizontal, 16)
                    .padding(.top, 12)

                    Spacer()

                    // Bottom message bar
                    HStack(spacing: 12) {
                        // Message input
                        HStack {
                            TextField("Send message", text: $messageText)
                                .font(.system(size: 16))
                                .foregroundColor(.white)
                                .accentColor(.white)

                            if messageText.isEmpty {
                                Image(systemName: "touchid")
                                    .font(.system(size: 20))
                                    .foregroundColor(.white.opacity(0.6))
                            }
                        }
                        .padding(.horizontal, 16)
                        .padding(.vertical, 12)
                        .background(
                            Capsule()
                                .stroke(Color.white.opacity(0.3), lineWidth: 1)
                        )

                        // Reaction buttons
                        HStack(spacing: 8) {
                            Text("❤️")
                                .font(.system(size: 28))
                            Text("😆")
                                .font(.system(size: 28))
                            Text("🐶")
                                .font(.system(size: 28))
                        }
                    }
                    .padding(.horizontal, 16)
                    .padding(.bottom, 16)
                }

                // Tap gesture areas
                HStack(spacing: 0) {
                    // Left side - go to previous
                    Color.clear
                        .contentShape(Rectangle())
                        .onTapGesture {
                            goToPrevious()
                        }
                        .onLongPressGesture(
                            minimumDuration: .infinity,
                            pressing: { pressing in
                                if pressing {
                                    pauseStory()
                                } else {
                                    resumeStory()
                                }
                            }, perform: {})

                    // Right side - go to next
                    Color.clear
                        .contentShape(Rectangle())
                        .onTapGesture {
                            goToNext()
                        }
                        .onLongPressGesture(
                            minimumDuration: .infinity,
                            pressing: { pressing in
                                if pressing {
                                    pauseStory()
                                } else {
                                    resumeStory()
                                }
                            }, perform: {})
                }
            }
        }
        .onAppear {
            startProgress()
        }
        .onDisappear {
            stopTimer()
        }
    }

    private func storyGradient(for index: Int) -> LinearGradient {
        let gradients: [[Color]] = [
            [.blue.opacity(0.3), .purple.opacity(0.5), .pink.opacity(0.3)],
            [.orange.opacity(0.3), .red.opacity(0.5), .yellow.opacity(0.3)],
            [.green.opacity(0.3), .teal.opacity(0.5), .blue.opacity(0.3)],
        ]
        let colors = gradients[index % gradients.count]
        return LinearGradient(colors: colors, startPoint: .topLeading, endPoint: .bottomTrailing)
    }

    private func progressFor(index: Int) -> CGFloat {
        if index < currentIndex {
            return 1.0  // Completed
        } else if index == currentIndex {
            return progress  // Current progress
        } else {
            return 0  // Not started
        }
    }

    private func startProgress() {
        stopTimer()
        progress = 0
        startTime = Date()

        // Use Timer instead of animation for more control
        timer = Timer.scheduledTimer(withTimeInterval: 0.05, repeats: true) { _ in
            guard let start = startTime else { return }
            let elapsed = Date().timeIntervalSince(start)
            let newProgress = min(elapsed / storyDuration, 1.0)

            withAnimation(.linear(duration: 0.05)) {
                progress = newProgress
            }

            if newProgress >= 1.0 {
                goToNext()
            }
        }
    }

    private func stopTimer() {
        timer?.invalidate()
        timer = nil
    }

    private func goToNext() {
        stopTimer()
        if currentIndex < storyCount - 1 {
            currentIndex += 1
            startProgress()
        } else {
            isPresented = false
        }
    }

    private func goToPrevious() {
        stopTimer()
        if currentIndex > 0 {
            currentIndex -= 1
        }
        startProgress()
    }

    private func pauseStory() {
        isPaused = true
        pausedProgress = progress
        stopTimer()
    }

    private func resumeStory() {
        guard isPaused else { return }
        isPaused = false

        // Resume from where we paused by adjusting startTime backward
        startTime = Date().addingTimeInterval(-storyDuration * pausedProgress)

        timer = Timer.scheduledTimer(withTimeInterval: 0.05, repeats: true) { _ in
            guard let start = startTime else { return }
            let elapsed = Date().timeIntervalSince(start)
            let newProgress = min(elapsed / storyDuration, 1.0)

            withAnimation(.linear(duration: 0.05)) {
                progress = newProgress
            }

            if newProgress >= 1.0 {
                goToNext()
            }
        }
    }
}

#Preview {
    StoryViewerView(
        story: Story.sampleStories[1],
        isPresented: .constant(true)
    )
}
