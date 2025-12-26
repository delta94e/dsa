import SwiftUI

// MARK: - ImageStepView

/**
 Step 3: AI Image generation view.
 
 Allows users to generate or upload an avatar image for their AI.
 Shows generating state, generated image, or upload option.
 */
struct ImageStepView: View {
    
    // MARK: - Properties
    
    /// Reference to the shared ViewModel
    @Bindable var viewModel: CreateAIViewModel
    
    // MARK: - Body
    
    var body: some View {
        VStack(spacing: 16) {
            titleSection
            imagePreview
            Spacer()
            actionButtons
        }
        .onAppear {
            viewModel.startGeneratingImage()
        }
    }
    
    // MARK: - Title Section
    
    /// Title and subtitle text
    private var titleSection: some View {
        VStack(spacing: 8) {
            Text("What does your AI look like?")
                .font(.system(size: 24, weight: .bold))
                .multilineTextAlignment(.center)
                .frame(maxWidth: .infinity)
                .padding(.horizontal, 20)
                .padding(.top, 24)
            
            Text("You can edit what you see here or edit the prompt to create a new image.")
                .font(.system(size: 14))
                .foregroundColor(.gray)
                .multilineTextAlignment(.center)
                .padding(.horizontal, 32)
        }
    }
    
    // MARK: - Image Preview
    
    /// Container for image preview states
    private var imagePreview: some View {
        ZStack {
            RoundedRectangle(cornerRadius: 20)
                .fill(Color.gray.opacity(0.08))
                .aspectRatio(0.75, contentMode: .fit)
            
            imageContent
        }
        .padding(.horizontal, 40)
    }
    
    /// Content based on generation state
    @ViewBuilder
    private var imageContent: some View {
        if viewModel.isGeneratingImage {
            generatingStateView
        } else if viewModel.hasGeneratedImage {
            generatedImageView
        } else {
            generatingStateView
        }
    }
    
    /// Loading/generating state view
    private var generatingStateView: some View {
        VStack(spacing: 12) {
            Image(systemName: "sparkles")
                .font(.system(size: 28))
                .foregroundColor(.gray.opacity(0.4))
            
            Text("Generating image...")
                .font(.system(size: 16, weight: .semibold))
                .foregroundColor(.primary)
            
            Text("This shouldn't take long.")
                .font(.system(size: 14))
                .foregroundColor(.gray)
        }
    }
    
    /// Generated image preview with overlay controls
    private var generatedImageView: some View {
        ZStack(alignment: .topLeading) {
            generatedImageBackground
            avatarOverlay
            cropButton
        }
    }
    
    /// Background gradient for generated image
    private var generatedImageBackground: some View {
        LinearGradient(
            colors: [
                Color(red: 0.1, green: 0.2, blue: 0.4),
                Color(red: 0.2, green: 0.4, blue: 0.5),
            ],
            startPoint: .top,
            endPoint: .bottom
        )
        .overlay(
            VStack {
                Spacer()
                Image(systemName: "person.fill")
                    .font(.system(size: 60))
                    .foregroundColor(.white.opacity(0.8))
                Spacer()
            }
        )
        .clipShape(RoundedRectangle(cornerRadius: 20))
    }
    
    /// Small avatar overlay in top-left
    private var avatarOverlay: some View {
        Circle()
            .fill(Color.white)
            .frame(width: 40, height: 40)
            .overlay(
                Image(systemName: "person.fill")
                    .font(.system(size: 18))
                    .foregroundColor(.gray)
            )
            .padding(12)
    }
    
    /// Crop button in top-right
    private var cropButton: some View {
        HStack {
            Spacer()
            Button(action: {}) {
                Circle()
                    .fill(Color.black.opacity(0.6))
                    .frame(width: 36, height: 36)
                    .overlay(
                        Image(systemName: "crop")
                            .font(.system(size: 16))
                            .foregroundColor(.white)
                    )
            }
            .padding(12)
        }
    }
    
    // MARK: - Action Buttons
    
    /// Create and upload image buttons
    private var actionButtons: some View {
        HStack(spacing: 16) {
            createImageButton
            uploadImageButton
        }
        .padding(.bottom, 8)
    }
    
    /// Button to regenerate image
    private var createImageButton: some View {
        Button(action: viewModel.regenerateImage) {
            HStack(spacing: 6) {
                Image(systemName: "photo.badge.plus")
                    .font(.system(size: 16))
                Text("Create image")
                    .font(.system(size: 15))
            }
            .foregroundColor(.primary)
            .padding(.horizontal, 16)
            .padding(.vertical, 10)
            .background(outlineButtonBackground)
        }
    }
    
    /// Button to upload custom image
    private var uploadImageButton: some View {
        Button(action: handleUploadImage) {
            HStack(spacing: 6) {
                Image(systemName: "square.and.arrow.up")
                    .font(.system(size: 16))
                Text("Upload image")
                    .font(.system(size: 15))
            }
            .foregroundColor(.primary)
            .padding(.horizontal, 16)
            .padding(.vertical, 10)
            .background(outlineButtonBackground)
        }
    }
    
    /// Outlined button background
    private var outlineButtonBackground: some View {
        RoundedRectangle(cornerRadius: 20)
            .stroke(Color.gray.opacity(0.3), lineWidth: 1)
    }
    
    // MARK: - Private Methods
    
    /// Handles upload image action
    private func handleUploadImage() {
        viewModel.hasGeneratedImage = true
    }
}
