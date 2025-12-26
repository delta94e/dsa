import SwiftUI

// MARK: - CreateAIView

/**
 Main container view for the AI creation flow.
 
 Manages navigation between 5 steps and presents the final review screen.
 Uses `CreateAIViewModel` for state management.
 */
struct CreateAIView: View {
    
    // MARK: - Properties
    
    /// Binding to control view presentation
    @Binding var isPresented: Bool
    
    /// Callback to dismiss all the way to home screen
    var onDismissToHome: (() -> Void)? = nil
    
    /// Callback when AI creation is complete
    var onCreateAIComplete: ((String, String) -> Void)? = nil
    
    /// ViewModel containing all state and logic
    @State private var viewModel = CreateAIViewModel()
    
    /// Focus state for description text field
    @FocusState private var isDescriptionFocused: Bool
    
    /// Focus state for name text field
    @FocusState private var isNameFocused: Bool
    
    /// Focus state for introduction text field
    @FocusState private var isIntroFocused: Bool
    
    // MARK: - Body
    
    var body: some View {
        VStack(spacing: 0) {
            headerView
            progressBar
            stepContent
                .id(viewModel.currentStep)
                .transition(.asymmetric(
                    insertion: .move(edge: .trailing).combined(with: .opacity),
                    removal: .move(edge: .leading).combined(with: .opacity)
                ))
                .animation(.easeInOut(duration: 0.3), value: viewModel.currentStep)
            Spacer()
            
            if viewModel.showNextButton {
                nextButton
            }
        }
        .background(Color.white)
        .onTapGesture {
            dismissAllKeyboards()
        }
        .fullScreenCover(isPresented: $viewModel.showReview) {
            ReviewStepView(
                viewModel: viewModel,
                isPresented: $isPresented,
                showReview: $viewModel.showReview,
                onDismissToHome: onDismissToHome,
                onCreateAIComplete: onCreateAIComplete
            )
        }
    }
    
    // MARK: - Header View
    
    /// Navigation header with back, title, and cancel buttons
    private var headerView: some View {
        HStack {
            Button(action: handleBack) {
                Image(systemName: "chevron.left")
                    .font(.system(size: 20, weight: .medium))
                    .foregroundColor(.primary)
            }
            
            Spacer()
            
            Text("Create an AI")
                .font(.system(size: 17, weight: .semibold))
            
            Spacer()
            
            cancelButton
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 12)
        .background(Color.white)
    }
    
    /// Cancel button or invisible placeholder
    @ViewBuilder
    private var cancelButton: some View {
        if viewModel.currentStep > 1 {
            Button("Cancel") {
                isPresented = false
            }
            .font(.system(size: 17))
            .foregroundColor(.messengerBlue)
        } else {
            Text("Cancel")
                .font(.system(size: 17))
                .foregroundColor(.clear)
        }
    }
    
    // MARK: - Progress Bar
    
    /// Visual indicator of current step progress
    private var progressBar: some View {
        HStack(spacing: 4) {
            ForEach(1...viewModel.totalSteps, id: \.self) { step in
                RoundedRectangle(cornerRadius: 2)
                    .fill(step <= viewModel.currentStep ? Color.messengerBlue : Color.gray.opacity(0.3))
                    .frame(height: 4)
            }
        }
        .padding(.horizontal, 16)
        .padding(.top, 8)
        .background(Color.white)
    }
    
    // MARK: - Step Content
    
    /// Renders the appropriate step view based on current step
    @ViewBuilder
    private var stepContent: some View {
        switch viewModel.currentStep {
        case 1:
            DescriptionStepView(viewModel: viewModel, isDescriptionFocused: $isDescriptionFocused)
        case 2:
            PersonalityStepView(viewModel: viewModel)
        case 3:
            ImageStepView(viewModel: viewModel)
        case 4:
            NameStepView(viewModel: viewModel, isNameFocused: $isNameFocused)
        case 5:
            IntroStepView(viewModel: viewModel, isIntroFocused: $isIntroFocused)
        default:
            EmptyView()
        }
    }
    
    // MARK: - Next Button
    
    /// Primary action button to proceed to next step
    private var nextButton: some View {
        Button(action: viewModel.goNext) {
            Text(viewModel.nextButtonTitle)
                .font(.system(size: 17, weight: .semibold))
                .foregroundColor(.white)
                .frame(maxWidth: .infinity)
                .padding(.vertical, 16)
                .background(nextButtonBackground)
        }
        .disabled(!viewModel.canProceed)
        .padding(.horizontal, 16)
        .padding(.bottom, 16)
        .background(Color.white)
        .transition(.move(edge: .bottom).combined(with: .opacity))
    }
    
    /// Background for the next button based on state
    private var nextButtonBackground: some View {
        RoundedRectangle(cornerRadius: 30)
            .fill(viewModel.canProceed ? Color.messengerBlue : Color.gray.opacity(0.3))
    }
    
    // MARK: - Private Methods
    
    /// Handles back button action
    private func handleBack() {
        if viewModel.goBack() {
            isPresented = false
        }
    }
    
    /// Dismisses all keyboards
    private func dismissAllKeyboards() {
        isDescriptionFocused = false
        isNameFocused = false
        isIntroFocused = false
        UIApplication.shared.sendAction(
            #selector(UIResponder.resignFirstResponder),
            to: nil,
            from: nil,
            for: nil
        )
    }
}

// MARK: - Preview

#Preview {
    CreateAIView(isPresented: .constant(true))
}
