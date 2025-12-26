import SwiftUI

// MARK: - CreateAIViewModel

/**
 ViewModel for the Create AI multi-step flow.
 
 Manages all state and business logic for the 5-step AI creation process:
 1. Description - What does your AI do
 2. Personality - Roles and traits selection
 3. Image - AI avatar generation
 4. Name - AI naming
 5. Introduction - How AI introduces itself
 
 Uses `@Observable` macro for automatic SwiftUI updates.
 */
@Observable
class CreateAIViewModel {
    
    // MARK: - Navigation State
    
    /// Current step in the creation flow (1-5)
    var currentStep = 1
    
    /// Whether to show the review screen
    var showReview = false
    
    /// Total number of steps in the flow
    let totalSteps = 5
    
    // MARK: - Step 1: Description
    
    /// User-entered AI description
    var aiDescription = ""
    
    // MARK: - Step 2: Personality
    
    /// Selected roles for the AI (max 3)
    var selectedRoles: Set<String> = []
    
    /// Selected personality traits (max 5)
    var selectedTraits: Set<String> = []
    
    /// Whether personality suggestions are loading
    var isLoadingPersonality = false
    
    /// Available role options with emoji and name
    let roles: [(String, String)] = [
        ("😊", "Friend"),
        ("🏅", "Coach"),
        ("🤔", "Critic"),
    ]
    
    /// Available trait options with emoji and name
    let traits: [(String, String)] = [
        ("💁", "Sassy"),
        ("😎", "Confident"),
        ("🎯", "Direct"),
        ("😜", "Sarcastic"),
        ("🤪", "Playful"),
    ]
    
    // MARK: - Step 3: Image
    
    /// Whether image generation is in progress
    var isGeneratingImage = false
    
    /// Whether an image has been generated
    var hasGeneratedImage = false
    
    // MARK: - Step 4: Name
    
    /// User-entered AI name
    var aiName = ""
    
    /// Whether name suggestions are loading
    var isLoadingNames = false
    
    // MARK: - Step 5: Introduction
    
    /// User-entered AI introduction text
    var aiIntroduction = ""
    
    // MARK: - Review Settings
    
    /// Whether remixing is allowed for this AI
    var allowRemixing = true
    
    // MARK: - Computed Properties
    
    /// Determines if the Next button should be visible
    var showNextButton: Bool {
        switch currentStep {
        case 1: return !aiDescription.isEmpty
        case 2: return !isLoadingPersonality
        case 3: return true
        case 4: return !isLoadingNames
        case 5: return true
        default: return true
        }
    }
    
    /// Determines if user can proceed to next step
    var canProceed: Bool {
        switch currentStep {
        case 1: return !aiDescription.isEmpty
        case 2: return !selectedRoles.isEmpty || !selectedTraits.isEmpty
        case 3: return hasGeneratedImage
        case 4: return !aiName.isEmpty
        case 5: return !aiIntroduction.isEmpty
        default: return true
        }
    }
    
    /// Title text for the Next button
    var nextButtonTitle: String {
        currentStep == 5 ? "Review" : "Next"
    }
    
    // MARK: - Navigation Actions
    
    /**
     Navigates to the previous step.
     
     - Returns: `true` if view should be dismissed, `false` otherwise.
     */
    func goBack() -> Bool {
        if currentStep > 1 {
            withAnimation {
                currentStep -= 1
            }
            return false
        }
        return true
    }
    
    /// Navigates to the next step or shows review
    func goNext() {
        if currentStep == 1 {
            transitionToStep2()
        } else if currentStep == 5 {
            withAnimation {
                showReview = true
            }
        } else if currentStep < totalSteps {
            withAnimation {
                currentStep += 1
            }
        }
    }
    
    // MARK: - Step-Specific Actions
    
    /// Transitions to Step 2 with loading animation
    func transitionToStep2() {
        withAnimation {
            currentStep = 2
            isLoadingPersonality = true
        }
        
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) { [weak self] in
            withAnimation {
                self?.isLoadingPersonality = false
            }
        }
    }
    
    /// Starts the image generation process
    func startGeneratingImage() {
        isGeneratingImage = true
        
        DispatchQueue.main.asyncAfter(deadline: .now() + 2.5) { [weak self] in
            self?.isGeneratingImage = false
            self?.hasGeneratedImage = true
        }
    }
    
    /// Regenerates the AI avatar image
    func regenerateImage() {
        isGeneratingImage = true
        hasGeneratedImage = false
        
        DispatchQueue.main.asyncAfter(deadline: .now() + 2) { [weak self] in
            self?.isGeneratingImage = false
            self?.hasGeneratedImage = true
        }
    }
    
    /// Starts loading name suggestions
    func startLoadingNames() {
        isLoadingNames = true
        
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) { [weak self] in
            self?.isLoadingNames = false
        }
    }
    
    // MARK: - Selection Actions
    
    /**
     Toggles selection of a role.
     
     - Parameter role: The role to toggle.
     - Note: Maximum of 3 roles can be selected.
     */
    func toggleRole(_ role: String) {
        if selectedRoles.contains(role) {
            selectedRoles.remove(role)
        } else if selectedRoles.count < 3 {
            selectedRoles.insert(role)
        }
    }
    
    /**
     Toggles selection of a trait.
     
     - Parameter trait: The trait to toggle.
     - Note: Maximum of 5 traits can be selected.
     */
    func toggleTrait(_ trait: String) {
        if selectedTraits.contains(trait) {
            selectedTraits.remove(trait)
        } else if selectedTraits.count < 5 {
            selectedTraits.insert(trait)
        }
    }
}
