import 'package:flutter/material.dart';
import '../../config/theme.dart';
import '../../config/routes.dart';
import '../../widgets/common/gradient_background.dart';
import '../../widgets/common/primary_button.dart';
import '../../widgets/common/progress_indicator.dart';
import '../../widgets/onboarding/speak_logo.dart';

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  final PageController _pageController = PageController();
  int _currentPage = 0;

  final List<String> _headlines = [
    'Adults can become fluent — even faster than kids.',
    'The secret? Speaking early and often, not memorizing flashcards.',
    'Speak turns science into real speaking practice from Day 1.',
  ];

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  void _goToNextPage() {
    if (_currentPage < _headlines.length - 1) {
      _pageController.nextPage(
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeInOut,
      );
    } else {
      Navigator.pushNamed(context, AppRoutes.languageSelection);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: GradientBackground(
        child: SafeArea(
          child: Column(
            children: [
              // Header with Sign in button
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    TextButton(
                      onPressed: () {
                        // TODO: Navigate to sign in
                      },
                      child: const Text(
                        'Sign in',
                        style: TextStyle(
                          color: AppColors.primary,
                          fontSize: 16,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              
              // Main content
              Expanded(
                child: GestureDetector(
                  onTap: _goToNextPage,
                  behavior: HitTestBehavior.opaque,
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 32),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const SizedBox(height: 40),
                        
                        // Logo
                        const SpeakLogo(),
                        
                        const SizedBox(height: 32),
                        
                        // Progress indicator
                        StepProgressIndicator(
                          currentStep: _currentPage,
                          totalSteps: _headlines.length,
                        ),
                        
                        const SizedBox(height: 32),
                        
                        // Page view for headlines
                        Expanded(
                          child: PageView.builder(
                            controller: _pageController,
                            onPageChanged: (index) {
                              setState(() {
                                _currentPage = index;
                              });
                            },
                            itemCount: _headlines.length,
                            itemBuilder: (context, index) {
                              return Text(
                                _headlines[index],
                                style: Theme.of(context).textTheme.displayMedium,
                              );
                            },
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
              
              // Bottom area
              Padding(
                padding: const EdgeInsets.all(24),
                child: _currentPage == _headlines.length - 1
                    ? PrimaryButton(
                        text: 'Start speaking today',
                        onPressed: _goToNextPage,
                      )
                    : const Text(
                        'Tap to continue',
                        style: TextStyle(
                          fontSize: 16,
                          color: AppColors.textSecondary,
                        ),
                      ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
