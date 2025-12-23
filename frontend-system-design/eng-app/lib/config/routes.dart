import 'package:flutter/material.dart';
import '../screens/onboarding/onboarding_screen.dart';
import '../screens/setup/language_selection_screen.dart';
import '../screens/setup/native_language_screen.dart';
import '../screens/home/home_screen.dart';

class AppRoutes {
  static const String onboarding = '/';
  static const String languageSelection = '/language-selection';
  static const String nativeLanguage = '/native-language';
  static const String home = '/home';

  static Map<String, WidgetBuilder> get routes => {
        onboarding: (context) => const OnboardingScreen(),
        languageSelection: (context) => const LanguageSelectionScreen(),
        nativeLanguage: (context) => const NativeLanguageScreen(),
        home: (context) => const HomeScreen(),
      };
}
