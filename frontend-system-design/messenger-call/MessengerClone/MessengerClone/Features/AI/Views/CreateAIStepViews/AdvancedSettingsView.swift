import SwiftUI

// MARK: - AdvancedSettingsView

/**
 Advanced settings view for AI configuration.
 
 Allows users to configure:
 - Introduction text
 - Welcome message
 - Icebreakers
 - Instructions
 - Example dialogue
 - Capabilities (dynamic image generation)
 */
struct AdvancedSettingsView: View {
    
    // MARK: - Properties
    
    /// Binding to control view presentation
    @Binding var isPresented: Bool
    
    /// Reference to the shared ViewModel
    @Bindable var viewModel: CreateAIViewModel
    
    /// Welcome message text
    @State private var welcomeMessage = ""
    
    /// Icebreaker prompt
    @State private var icebreaker = ""
    
    /// Whether dynamic image generation is enabled
    @State private var dynamicImageGeneration = true
    
    /// Whether to show example dialogue sheet
    @State private var showExampleDialogue = false
    
    /// Whether to show instruction sheet
    @State private var showInstruction = false
    
    // MARK: - Constants
    
    private enum Constants {
        static let introMaxChars = 200
        static let welcomeMaxChars = 200
        static let icebreakerMaxChars = 80
        static let cornerRadius: CGFloat = 10
        static let horizontalPadding: CGFloat = 16
    }
    
    // MARK: - Body
    
    var body: some View {
        VStack(spacing: 0) {
            headerView
            
            ScrollView {
                VStack(alignment: .leading, spacing: 24) {
                    introductionSection
                    welcomeMessageSection
                    icebreakersSection
                    instructionsSection
                    exampleDialogueSection
                    capabilitiesSection
                }
                .padding(.top, 16)
                .padding(.bottom, 100)
            }
            
            doneButton
        }
        .background(Color.white)
        .fullScreenCover(isPresented: $showExampleDialogue) {
            ExampleDialogueView(isPresented: $showExampleDialogue)
        }
        .fullScreenCover(isPresented: $showInstruction) {
            InstructionView(isPresented: $showInstruction)
        }
    }
    
    // MARK: - Header
    
    /// Navigation header with back button
    private var headerView: some View {
        HStack {
            Button(action: { isPresented = false }) {
                Image(systemName: "chevron.left")
                    .font(.system(size: 20, weight: .medium))
                    .foregroundColor(.primary)
            }
            
            Spacer()
            
            Text("Advanced settings")
                .font(.system(size: 17, weight: .semibold))
            
            Spacer()
            
            // Invisible placeholder for centering
            Image(systemName: "chevron.left")
                .font(.system(size: 20, weight: .medium))
                .foregroundColor(.clear)
        }
        .padding(.horizontal, Constants.horizontalPadding)
        .padding(.vertical, 12)
        .background(Color.white)
    }
    
    // MARK: - Introduction Section
    
    /// Introduction text configuration
    private var introductionSection: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("Introduction")
                .font(.system(size: 17, weight: .semibold))
                .foregroundColor(.primary)
            
            Text("Enter in specific instructions for how your AI should respond, like how it speaks or what it says in certain scenarios.")
                .font(.system(size: 14))
                .foregroundColor(.gray)
            
            // Text editor with label
            VStack(alignment: .trailing, spacing: 4) {
                ZStack(alignment: .topLeading) {
                    RoundedRectangle(cornerRadius: Constants.cornerRadius)
                        .fill(Color.gray.opacity(0.1))
                    
                    VStack(alignment: .leading, spacing: 4) {
                        Text("Introduction")
                            .font(.system(size: 12))
                            .foregroundColor(.gray)
                        
                        TextEditor(text: $viewModel.aiIntroduction)
                            .font(.system(size: 16))
                            .scrollContentBackground(.hidden)
                            .frame(minHeight: 100)
                    }
                    .padding(12)
                }
                .frame(minHeight: 140)
                
                Text("\(viewModel.aiIntroduction.count)/\(Constants.introMaxChars)")
                    .font(.system(size: 13))
                    .foregroundColor(.gray)
            }
        }
        .padding(.horizontal, Constants.horizontalPadding)
    }
    
    // MARK: - Welcome Message Section
    
    /// Welcome message configuration
    private var welcomeMessageSection: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("Welcome message")
                .font(.system(size: 17, weight: .semibold))
                .foregroundColor(.primary)
            
            Text("How does your AI greet new people? If left blank, this will be autogenerated based on your AI's description.")
                .font(.system(size: 14))
                .foregroundColor(.gray)
            
            VStack(alignment: .trailing, spacing: 4) {
                ZStack(alignment: .topLeading) {
                    RoundedRectangle(cornerRadius: Constants.cornerRadius)
                        .fill(Color.gray.opacity(0.1))
                    
                    TextEditor(text: $welcomeMessage)
                        .font(.system(size: 16))
                        .scrollContentBackground(.hidden)
                        .frame(minHeight: 60)
                        .padding(12)
                        .overlay(alignment: .topLeading) {
                            if welcomeMessage.isEmpty {
                                Text("Welcome message")
                                    .font(.system(size: 16))
                                    .foregroundColor(.gray.opacity(0.5))
                                    .padding(16)
                                    .allowsHitTesting(false)
                            }
                        }
                }
                .frame(minHeight: 80)
                
                Text("\(welcomeMessage.count)/\(Constants.welcomeMaxChars)")
                    .font(.system(size: 13))
                    .foregroundColor(.gray)
            }
        }
        .padding(.horizontal, Constants.horizontalPadding)
    }
    
    // MARK: - Icebreakers Section
    
    /// Icebreakers prompts configuration
    private var icebreakersSection: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("Icebreakers")
                .font(.system(size: 17, weight: .semibold))
                .foregroundColor(.primary)
            
            Text("Give people suggested prompts to start the conversation with your AI.")
                .font(.system(size: 14))
                .foregroundColor(.gray)
            
            // Single icebreaker field
            VStack(alignment: .trailing, spacing: 4) {
                ZStack(alignment: .topLeading) {
                    RoundedRectangle(cornerRadius: Constants.cornerRadius)
                        .fill(Color.gray.opacity(0.1))
                    
                    TextEditor(text: $icebreaker)
                        .font(.system(size: 16))
                        .scrollContentBackground(.hidden)
                        .frame(minHeight: 40)
                        .padding(12)
                        .overlay(alignment: .topLeading) {
                            if icebreaker.isEmpty {
                                Text("Icebreaker")
                                    .font(.system(size: 16))
                                    .foregroundColor(.gray.opacity(0.5))
                                    .padding(16)
                                    .allowsHitTesting(false)
                            }
                        }
                }
                .frame(minHeight: 60)
                
                Text("\(icebreaker.count)/\(Constants.icebreakerMaxChars)")
                    .font(.system(size: 13))
                    .foregroundColor(.gray)
            }
        }
        .padding(.horizontal, Constants.horizontalPadding)
    }
    
    // MARK: - Instructions Section
    
    /// Instructions configuration with Add button
    private var instructionsSection: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Text("Instructions")
                    .font(.system(size: 17, weight: .semibold))
                    .foregroundColor(.primary)
                
                Spacer()
                
                Button("Add") {
                    showInstruction = true
                }
                    .font(.system(size: 16))
                    .foregroundColor(.messengerBlue)
            }
            
            Text("Enter in specific instructions for how your AI should respond, like how it speaks or what it says in certain scenarios.")
                .font(.system(size: 14))
                .foregroundColor(.gray)
        }
        .padding(.horizontal, Constants.horizontalPadding)
    }
    
    // MARK: - Example Dialogue Section
    
    /// Example dialogue configuration with Add button
    private var exampleDialogueSection: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Text("Example dialogue")
                    .font(.system(size: 17, weight: .semibold))
                    .foregroundColor(.primary)
                
                Spacer()
                
                Button("Add") {
                    showExampleDialogue = true
                }
                    .font(.system(size: 16))
                    .foregroundColor(.messengerBlue)
            }
            
            Text("Enter prompts and answer them in the specific style you want your AI to exhibit. The more unique your answers, the more refined your AI will be.")
                .font(.system(size: 14))
                .foregroundColor(.gray)
        }
        .padding(.horizontal, Constants.horizontalPadding)
    }
    
    // MARK: - Capabilities Section
    
    /// AI capabilities configuration
    private var capabilitiesSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Capabilities")
                .font(.system(size: 17, weight: .semibold))
                .foregroundColor(.primary)
            
            Text("Select the capabilities you'd like your AI to have.")
                .font(.system(size: 14))
                .foregroundColor(.gray)
            
            // Dynamic image generation toggle
            HStack(alignment: .top, spacing: 12) {
                // Image icon
                ZStack {
                    RoundedRectangle(cornerRadius: 8)
                        .fill(Color.gray.opacity(0.1))
                        .frame(width: 40, height: 40)
                    
                    Image(systemName: "photo")
                        .font(.system(size: 18))
                        .foregroundColor(.primary)
                }
                
                VStack(alignment: .leading, spacing: 4) {
                    Text("Dynamic image generation")
                        .font(.system(size: 16, weight: .medium))
                        .foregroundColor(.primary)
                    
                    Text("Autonomously generate images when appropriate. The AI can still generate images when explicitly asked to if this is off.")
                        .font(.system(size: 13))
                        .foregroundColor(.gray)
                        .fixedSize(horizontal: false, vertical: true)
                }
                
                Spacer()
                
                CustomToggle(isOn: $dynamicImageGeneration)
            }
        }
        .padding(.horizontal, Constants.horizontalPadding)
    }
    
    // MARK: - Done Button
    
    /// Primary action button
    private var doneButton: some View {
        Button(action: { isPresented = false }) {
            Text("Done")
                .font(.system(size: 17, weight: .semibold))
                .foregroundColor(.white)
                .frame(maxWidth: .infinity)
                .padding(.vertical, 16)
                .background(
                    RoundedRectangle(cornerRadius: 30)
                        .fill(Color.messengerBlue)
                )
        }
        .padding(.horizontal, Constants.horizontalPadding)
        .padding(.vertical, 12)
        .background(Color.white)
    }
}

// MARK: - Preview

#Preview {
    AdvancedSettingsView(
        isPresented: .constant(true),
        viewModel: CreateAIViewModel()
    )
}
