import SwiftUI

// MARK: - PersonalityStepView

/**
 Step 2: AI Personality selection view.
 
 Allows users to select roles and personality traits for their AI.
 Supports up to 3 roles and 5 traits.
 */
struct PersonalityStepView: View {
    
    // MARK: - Properties
    
    /// Reference to the shared ViewModel
    @Bindable var viewModel: CreateAIViewModel
    
    // MARK: - Body
    
    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 24) {
                titleText
                rolesSection
                traitsSection
            }
        }
    }
    
    // MARK: - Title
    
    /// Main title text
    private var titleText: some View {
        Text("How would you describe your AI's personality?")
            .font(.system(size: 24, weight: .bold))
            .multilineTextAlignment(.center)
            .frame(maxWidth: .infinity)
            .padding(.horizontal, 20)
            .padding(.top, 24)
    }
    
    // MARK: - Roles Section
    
    /// Section for role selection
    private var rolesSection: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("What type of role does your AI play?")
                .font(.system(size: 16, weight: .semibold))
            
            Text("These roles are based on your AI description. Choose up to three options or add your own.")
                .font(.system(size: 14))
                .foregroundColor(.gray)
            
            roleChips
        }
        .padding(.horizontal, 16)
    }
    
    /// Role selection chips or loading state
    @ViewBuilder
    private var roleChips: some View {
        if viewModel.isLoadingPersonality {
            loadingRoleChips
        } else {
            FlowLayout(spacing: 8) {
                ForEach(viewModel.roles, id: \.1) { emoji, role in
                    ChipButton(
                        emoji: emoji,
                        text: role,
                        isSelected: viewModel.selectedRoles.contains(role),
                        action: { viewModel.toggleRole(role) }
                    )
                }
                
                AddYourOwnButton()
            }
        }
    }
    
    /// Loading shimmer chips for roles
    private var loadingRoleChips: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack(spacing: 8) {
                ShimmerChip(width: 120)
                ShimmerChip(width: 80)
            }
            ShimmerChip(width: 100)
        }
    }
    
    // MARK: - Traits Section
    
    /// Section for trait selection
    private var traitsSection: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("What are some of your AI's personality traits?")
                .font(.system(size: 16, weight: .semibold))
            
            Text("These traits are based on your AI description. Choose up to five options or add your own.")
                .font(.system(size: 14))
                .foregroundColor(.gray)
            
            traitChips
        }
        .padding(.horizontal, 16)
    }
    
    /// Trait selection chips or loading state
    @ViewBuilder
    private var traitChips: some View {
        if viewModel.isLoadingPersonality {
            loadingTraitChips
        } else {
            FlowLayout(spacing: 8) {
                ForEach(viewModel.traits, id: \.1) { emoji, trait in
                    ChipButton(
                        emoji: emoji,
                        text: trait,
                        isSelected: viewModel.selectedTraits.contains(trait),
                        action: { viewModel.toggleTrait(trait) }
                    )
                }
                
                AddYourOwnButton()
            }
        }
    }
    
    /// Loading shimmer chips for traits
    private var loadingTraitChips: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack(spacing: 8) {
                ShimmerChip(width: 140)
                ShimmerChip(width: 90)
                ShimmerChip(width: 70)
            }
            HStack(spacing: 8) {
                ShimmerChip(width: 100)
                ShimmerChip(width: 110)
            }
            ShimmerChip(width: 120)
        }
    }
}
