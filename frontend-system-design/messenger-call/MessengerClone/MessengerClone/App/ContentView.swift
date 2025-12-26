import SwiftUI
import UserNotifications

// MARK: - GlobalLoadingManager

/**
 Manages global loading state for the app.
 
 - Note: Used to show a loading overlay that covers all views including sheets/fullScreenCovers.
 */
@Observable
class GlobalLoadingManager {
    
    /// Whether loading overlay is visible.
    var isLoading = false
    
    /// Callback to execute after loading completes.
    var onComplete: (() -> Void)?
    
    /**
     Shows loading overlay for specified duration then executes callback.
     
     - Parameters:
       - duration: How long to show loading (default 2 seconds).
       - completion: Callback to execute after loading.
     */
    func showLoading(duration: Double = 2.0, completion: @escaping () -> Void) {
        isLoading = true
        onComplete = completion
        
        DispatchQueue.main.asyncAfter(deadline: .now() + duration) { [weak self] in
            self?.isLoading = false
            self?.onComplete?()
            self?.onComplete = nil
        }
    }
    
    /// Hides loading overlay immediately.
    func hideLoading() {
        isLoading = false
        onComplete = nil
    }
}

// MARK: - LocalNotificationManager

/**
 Manages local push notifications for the app.
 
 - Note: Notifications appear in system notification center when app is in background.
 */
class LocalNotificationManager: ObservableObject {
    
    /// Shared instance.
    static let shared = LocalNotificationManager()
    
    private init() {}
    
    /// Requests permission to send notifications.
    func requestPermission() {
        UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .sound, .badge]) { granted, error in
            if granted {
                print("✅ Notification permission granted")
            } else if let error = error {
                print("❌ Notification permission error: \(error.localizedDescription)")
            }
        }
    }
    
    /**
     Sends a local notification.
     
     - Parameters:
       - title: The notification title.
       - body: The notification body message.
       - delay: Delay in seconds before showing (default 1 second).
     */
    func sendNotification(title: String, body: String, delay: TimeInterval = 1) {
        let content = UNMutableNotificationContent()
        content.title = title
        content.body = body
        content.sound = .default
        
        let trigger = UNTimeIntervalNotificationTrigger(timeInterval: delay, repeats: false)
        let request = UNNotificationRequest(
            identifier: UUID().uuidString,
            content: content,
            trigger: trigger
        )
        
        UNUserNotificationCenter.current().add(request) { error in
            if let error = error {
                print("❌ Failed to schedule notification: \(error.localizedDescription)")
            } else {
                print("✅ Notification scheduled: \(title)")
            }
        }
    }
}

// MARK: - ContentView

struct ContentView: View {
    @State private var selectedTab: AppTab = .chats
    @State private var isSearchActive = false
    @StateObject private var notificationManager = NotificationManager()
    @State private var globalLoadingManager = GlobalLoadingManager()
    @Namespace private var searchAnimation
    
    var body: some View {
        ZStack {
            // Main content - always rendered but opacity controlled
            VStack(spacing: 0) {
                // Header
                HeaderView(globalLoadingManager: globalLoadingManager)
                    .opacity(isSearchActive ? 0 : 1)
                
                // Search bar (tappable)
                if !isSearchActive {
                    SearchBarView(onTap: {
                        withAnimation(.easeOut(duration: 0.18)) {
                            isSearchActive = true
                        }
                    })
                    .padding(.vertical, 8)
                }
                
                // Main content based on selected tab
                Group {
                    switch selectedTab {
                    case .chats:
                        ChatsView(chats: Chat.sampleChats, stories: Story.sampleStories)
                    case .stories:
                        Spacer()
                        Text("Stories")
                            .font(.title)
                            .foregroundColor(.lightGray)
                        Spacer()
                    case .notifications:
                        Spacer()
                        Text("Notifications")
                            .font(.title)
                            .foregroundColor(.lightGray)
                        Spacer()
                    case .menu:
                        Spacer()
                        Text("Menu")
                            .font(.title)
                            .foregroundColor(.lightGray)
                        Spacer()
                    }
                    
                    // Tab bar
                    TabBarView(selectedTab: $selectedTab)
                }
                .opacity(isSearchActive ? 0 : 1)
            }
            .background(Color.white)
            
            // Search view - always in hierarchy, controlled by opacity and offset
            SearchView(isPresented: $isSearchActive, searchAnimation: searchAnimation)
                .opacity(isSearchActive ? 1 : 0)
                .allowsHitTesting(isSearchActive)
            
            // Notification Banner
            VStack {
                if notificationManager.showNotification {
                    NotificationBannerView(
                        senderName: notificationManager.senderName,
                        message: notificationManager.message,
                        onTap: {
                            notificationManager.dismiss()
                        }
                    )
                    .transition(.move(edge: .top).combined(with: .opacity))
                    .padding(.top, 4)
                    .gesture(
                        DragGesture()
                            .onEnded { value in
                                if value.translation.height < -20 {
                                    notificationManager.dismiss()
                                }
                            }
                    )
                }
                Spacer()
            }
            
            // Global Loading Overlay - covers EVERYTHING including sheets
            if globalLoadingManager.isLoading {
                globalLoadingOverlay
            }
        }
        .environmentObject(notificationManager)
        .environment(globalLoadingManager)
        .onAppear {
            // Request notification permission
            LocalNotificationManager.shared.requestPermission()
            
            // Demo: Show in-app notification after 3 seconds
            DispatchQueue.main.asyncAfter(deadline: .now() + 3) {
                notificationManager.showMessage(
                    from: "Nguyễn Khanh",
                    message: "Má gần round cuối vẫn algo"
                )
            }
            
            // Demo: Send system notification after 5 seconds (visible when app in background)
            LocalNotificationManager.shared.sendNotification(
                title: "MessengerClone",
                body: "Welcome! Try creating an AI chat.",
                delay: 5
            )
        }
    }
    
    /// Global loading overlay with spinner.
    private var globalLoadingOverlay: some View {
        ZStack {
            Color.white
                .ignoresSafeArea()
            
            ProgressView()
                .scaleEffect(1.5)
                .tint(.gray)
        }
    }
}

#Preview {
    ContentView()
}
