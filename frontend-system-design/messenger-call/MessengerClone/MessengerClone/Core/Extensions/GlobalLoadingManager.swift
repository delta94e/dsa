import SwiftUI

// MARK: - GlobalLoadingManager

/**
 Manages global loading state for the app.
 
 - Note: Used to show a loading overlay that covers all views including sheets/fullScreenCovers.
 */
@Observable
class GlobalLoadingManager {
    
    // MARK: - Properties
    
    /// Whether loading overlay is visible.
    var isLoading = false
    
    /// Callback to execute after loading completes.
    var onComplete: (() -> Void)?
    
    // MARK: - Methods
    
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
