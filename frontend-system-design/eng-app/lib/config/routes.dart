import 'package:flutter/material.dart';
import '../screens/splash_screen.dart';
import '../screens/onboarding/onboarding_screen.dart';
import '../screens/setup/language_selection_screen.dart';
import '../screens/setup/native_language_screen.dart';
import '../screens/auth/sign_up_screen.dart';
import '../screens/auth/sign_in_screen.dart';
import '../screens/main_navigation.dart';
import '../screens/course/course_home_screen.dart';
import '../screens/freetalk/free_talk_screen.dart';
import '../screens/review/review_screen.dart';
import '../screens/challenge/challenge_screen.dart';
import '../screens/practice/practice_screen.dart';
import '../screens/profile/profile_screen.dart';
import '../screens/subscription/premium_upsell_screen.dart';
import '../screens/subscription/subscription_screen.dart';
import '../screens/home/home_screen.dart';
import '../screens/lesson/video_lesson_screen.dart';
import '../screens/level/select_level_screen.dart';

class AppRoutes {
  static const String splash = '/';
  static const String onboarding = '/onboarding';
  static const String languageSelection = '/language-selection';
  static const String nativeLanguage = '/native-language';
  static const String signUp = '/sign-up';
  static const String signIn = '/sign-in';
  static const String mainNav = '/main';
  static const String courseHome = '/course';
  static const String freeTalk = '/free-talk';
  static const String review = '/review';
  static const String challenge = '/challenge';
  static const String practice = '/practice';
  static const String profile = '/profile';
  static const String premiumUpsell = '/premium-upsell';
  static const String subscription = '/subscription';
  static const String home = '/home';
  static const String videoLesson = '/video-lesson';
  static const String selectLevel = '/select-level';

  static Map<String, WidgetBuilder> get routes => {
        splash: (context) => const SplashScreen(),
        onboarding: (context) => const OnboardingScreen(),
        languageSelection: (context) => const LanguageSelectionScreen(),
        nativeLanguage: (context) => const NativeLanguageScreen(),
        signUp: (context) => const SignUpScreen(),
        signIn: (context) => const SignInScreen(),
        mainNav: (context) => const MainNavigation(),
        courseHome: (context) => const CourseHomeScreen(),
        freeTalk: (context) => const FreeTalkScreen(),
        review: (context) => const ReviewScreen(),
        challenge: (context) => const ChallengeScreen(),
        practice: (context) => const PracticeScreen(),
        profile: (context) => const ProfileScreen(),
        premiumUpsell: (context) => const PremiumUpsellScreen(),
        subscription: (context) => const SubscriptionScreen(),
        home: (context) => const HomeScreen(),
        videoLesson: (context) => const VideoLessonScreen(),
        selectLevel: (context) => const SelectLevelScreen(),
      };
}
