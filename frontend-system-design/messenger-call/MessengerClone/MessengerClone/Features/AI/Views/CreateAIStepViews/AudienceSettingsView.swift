import SwiftUI

// MARK: - AudienceSettingsView

/**
 Audience settings view for AI visibility configuration.
 
 Allows users to select:
 - Who can see the AI (Public, Friends, Only me)
 - Creator label visibility
 - Platform availability (Instagram, WhatsApp)
 */
struct AudienceSettingsView: View {
    
    // MARK: - Properties
    
    /// Binding to control view presentation
    @Binding var isPresented: Bool
    
    /// Selected audience option
    @State private var selectedAudience: AudienceOption = .publicAudience
    
    /// Whether to hide creator label
    @State private var hideCreatorLabel = false
    
    /// Whether AI is discoverable on Instagram
    @State private var isInstagramEnabled = true
    
    /// Whether AI is discoverable on WhatsApp
    @State private var isWhatsAppEnabled = true
    
    // MARK: - Body
    
    var body: some View {
        VStack(spacing: 0) {
            headerView
            
            ScrollView {
                VStack(alignment: .leading, spacing: 0) {
                    visibilitySection
                    labelSection
                    platformSection
                }
            }
        }
        .background(Color(UIColor.systemGroupedBackground))
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
            
            Text("Audience")
                .font(.system(size: 17, weight: .semibold))
            
            Spacer()
            
            // Invisible placeholder for centering
            Image(systemName: "chevron.left")
                .font(.system(size: 20, weight: .medium))
                .foregroundColor(.clear)
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 12)
        .background(Color.white)
    }
    
    // MARK: - Visibility Section
    
    /// Who can see your AI section
    private var visibilitySection: some View {
        VStack(alignment: .leading, spacing: 0) {
            // Section header (on gray background)
            Text("Who can see your AI?")
                .font(.system(size: 13, weight: .medium))
                .foregroundColor(.gray)
                .padding(.horizontal, 16)
                .padding(.top, 16)
                .padding(.bottom, 8)
            
            // White card with options
            VStack(spacing: 0) {
                ForEach(Array(AudienceOption.allCases.enumerated()), id: \.element) { index, option in
                    audienceRow(option)
                    
                    // Add divider between items (not after last)
                    if index < AudienceOption.allCases.count - 1 {
                        Divider()
                            .padding(.leading, 16)
                    }
                }
            }
            .background(Color.white)
            .cornerRadius(10)
            .padding(.horizontal, 16)
        }
    }
    
    /// Individual audience option row
    private func audienceRow(_ option: AudienceOption) -> some View {
        Button(action: { selectedAudience = option }) {
            HStack {
                VStack(alignment: .leading, spacing: 2) {
                    Text(option.title)
                        .font(.system(size: 16))
                        .foregroundColor(.primary)
                    
                    if let subtitle = option.subtitle {
                        Text(subtitle)
                            .font(.system(size: 13))
                            .foregroundColor(.gray)
                            .multilineTextAlignment(.leading)
                            .fixedSize(horizontal: false, vertical: true)
                    }
                }
                
                Spacer()
                
                if selectedAudience == option {
                    Image(systemName: "checkmark")
                        .font(.system(size: 16, weight: .medium))
                        .foregroundColor(.messengerBlue)
                }
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 12)
        }
    }
    
    // MARK: - Label Section
    
    /// Creator label visibility section
    private var labelSection: some View {
        VStack(alignment: .leading, spacing: 0) {
            // Section header (on gray background)
            Text("What label appears on your AI")
                .font(.system(size: 13, weight: .medium))
                .foregroundColor(.gray)
                .padding(.horizontal, 16)
                .padding(.top, 24)
                .padding(.bottom, 8)
            
            // White card with toggle
            VStack(alignment: .leading, spacing: 0) {
                HStack {
                    Text("Hide creator label")
                        .font(.system(size: 16))
                        .foregroundColor(.primary)
                    
                    Spacer()
                    
                    CustomToggle(isOn: $hideCreatorLabel)
                }
                .padding(.horizontal, 16)
                .padding(.vertical, 12)
            }
            .background(Color.white)
            .cornerRadius(10)
            .padding(.horizontal, 16)
            
            // Footer text (on gray background)
            Text("Your name won't appear next to this AI.")
                .font(.system(size: 13))
                .foregroundColor(.gray)
                .padding(.horizontal, 16)
                .padding(.top, 8)
        }
    }
    
    // MARK: - Platform Section
    
    /// Platform availability section
    private var platformSection: some View {
        VStack(alignment: .leading, spacing: 0) {
            // Section header (on gray background)
            Text("Where your AI appears")
                .font(.system(size: 13, weight: .medium))
                .foregroundColor(.gray)
                .padding(.horizontal, 16)
                .padding(.top, 24)
                .padding(.bottom, 8)
            
            // White card with platform options
            VStack(spacing: 0) {
                // Messenger and Facebook - always enabled
                VStack(alignment: .leading, spacing: 2) {
                    Text("Messenger and Facebook")
                        .font(.system(size: 16))
                        .foregroundColor(.primary)
                    
                    Text("Always discoverable")
                        .font(.system(size: 13))
                        .foregroundColor(.gray)
                }
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding(.horizontal, 16)
                .padding(.vertical, 12)
                
                Divider().padding(.leading, 16)
                
                // Instagram toggle
                platformToggleRow(title: "Instagram", isOn: $isInstagramEnabled)
                
                Divider().padding(.leading, 16)
                
                // WhatsApp toggle
                platformToggleRow(title: "WhatsApp", isOn: $isWhatsAppEnabled)
            }
            .background(Color.white)
            .cornerRadius(10)
            .padding(.horizontal, 16)
            
            // Footer text (on gray background)
            Text("Anyone on these apps can discover and chat with your AI.")
                .font(.system(size: 13))
                .foregroundColor(.gray)
                .padding(.horizontal, 16)
                .padding(.top, 8)
        }
    }
    
    /// Platform toggle row
    private func platformToggleRow(title: String, isOn: Binding<Bool>) -> some View {
        HStack {
            Text(title)
                .font(.system(size: 16))
                .foregroundColor(.primary)
            
            Spacer()
            
            CustomToggle(isOn: isOn)
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 12)
    }
}

// MARK: - AudienceOption

/// Available audience visibility options
enum AudienceOption: CaseIterable {
    case publicAudience
    case friends
    case onlyMe
    
    /// Display title for the option
    var title: String {
        switch self {
        case .publicAudience: return "Public"
        case .friends: return "Friends"
        case .onlyMe: return "Only me"
        }
    }
    
    /// Optional subtitle description
    var subtitle: String? {
        switch self {
        case .publicAudience: return "Anyone can chat with your AI and see that you created it."
        case .friends: return "Your Facebook friends"
        case .onlyMe: return nil
        }
    }
}

// MARK: - Preview

#Preview {
    AudienceSettingsView(isPresented: .constant(true))
}
