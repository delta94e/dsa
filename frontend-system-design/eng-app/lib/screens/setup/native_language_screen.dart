import 'package:flutter/material.dart';
import '../../config/theme.dart';
import '../../config/routes.dart';
import '../../models/language.dart';
import '../../widgets/common/primary_button.dart';
import '../../widgets/setup/bot_avatar.dart';
import '../../widgets/setup/chat_bubble.dart';
import '../../widgets/setup/selection_card.dart';

class NativeLanguageScreen extends StatefulWidget {
  const NativeLanguageScreen({super.key});

  @override
  State<NativeLanguageScreen> createState() => _NativeLanguageScreenState();
}

class _NativeLanguageScreenState extends State<NativeLanguageScreen> {
  String? _selectedLanguageCode;

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

            // Bot avatar and chat bubble
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const BotAvatar(),
                  const SizedBox(width: 12),
                  const Flexible(
                    child: ChatBubble(
                      message: 'What is your native language?',
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 24),

            // Language list with native scripts
            Expanded(
              child: ListView.separated(
                padding: const EdgeInsets.symmetric(horizontal: 24),
                itemCount: Language.nativeLanguages.length,
                separatorBuilder: (context, index) => const SizedBox(height: 12),
                itemBuilder: (context, index) {
                  final language = Language.nativeLanguages[index];
                  return SelectionCard(
                    title: language.nativeName,
                    subtitle: language.name,
                    isSelected: _selectedLanguageCode == language.code,
                    onTap: () {
                      setState(() {
                        _selectedLanguageCode = language.code;
                      });
                    },
                  );
                },
              ),
            ),

            // Continue button
            Padding(
              padding: const EdgeInsets.all(24),
              child: PrimaryButton(
                text: 'Continue',
                isEnabled: _selectedLanguageCode != null,
                onPressed: () {
                  Navigator.pushNamed(context, AppRoutes.signUp);
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
