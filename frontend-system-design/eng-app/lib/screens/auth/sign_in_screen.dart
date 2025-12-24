import 'package:flutter/material.dart';
import '../../config/theme.dart';
import '../../config/routes.dart';
import '../../widgets/auth/social_login_button.dart';

class SignInScreen extends StatelessWidget {
  const SignInScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Column(
          children: [
            // Header with back button
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 8),
              child: Row(
                children: [
                  IconButton(
                    onPressed: () => Navigator.pop(context),
                    icon: const Icon(
                      Icons.chevron_left,
                      size: 32,
                      color: AppColors.textPrimary,
                    ),
                  ),
                ],
              ),
            ),

            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 24),
                child: Column(
                  children: [
                    const SizedBox(height: 40),

                    // Title
                    Text(
                      'Sign in to continue',
                      textAlign: TextAlign.center,
                      style: Theme.of(context).textTheme.headlineLarge,
                    ),

                    const SizedBox(height: 40),

                    // Social login buttons
                    SocialLoginButton(
                      type: SocialLoginType.email,
                      onPressed: () {
                        // TODO: Email sign in
                      },
                    ),
                    const SizedBox(height: 12),
                    SocialLoginButton(
                      type: SocialLoginType.google,
                      onPressed: () {
                        // TODO: Google sign in
                      },
                    ),
                    const SizedBox(height: 12),
                    SocialLoginButton(
                      type: SocialLoginType.apple,
                      onPressed: () {
                        // TODO: Apple sign in
                      },
                    ),
                    const SizedBox(height: 12),
                    SocialLoginButton(
                      type: SocialLoginType.facebook,
                      onPressed: () {
                        // TODO: Facebook sign in
                      },
                    ),
                    const SizedBox(height: 12),
                    SocialLoginButton(
                      type: SocialLoginType.kakaoTalk,
                      onPressed: () {
                        // TODO: KakaoTalk sign in
                      },
                    ),
                    const SizedBox(height: 12),
                    SocialLoginButton(
                      type: SocialLoginType.line,
                      onPressed: () {
                        // TODO: LINE sign in
                      },
                    ),

                    const SizedBox(height: 40),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
