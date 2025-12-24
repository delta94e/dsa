import 'package:flutter/material.dart';

enum SocialLoginType {
  email,
  google,
  apple,
  facebook,
  kakaoTalk,
  line,
}

class SocialLoginButton extends StatelessWidget {
  final SocialLoginType type;
  final VoidCallback? onPressed;

  const SocialLoginButton({
    super.key,
    required this.type,
    this.onPressed,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      height: 56,
      child: ElevatedButton(
        onPressed: onPressed,
        style: ElevatedButton.styleFrom(
          backgroundColor: _getBackgroundColor(),
          foregroundColor: _getForegroundColor(),
          elevation: 0,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(28),
            side: _getBorderSide(),
          ),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            _buildIcon(),
            const SizedBox(width: 12),
            Text(
              _getButtonText(),
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w600,
                color: _getForegroundColor(),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Color _getBackgroundColor() {
    switch (type) {
      case SocialLoginType.email:
        return const Color(0xFF2563EB);
      case SocialLoginType.google:
        return Colors.white;
      case SocialLoginType.apple:
        return Colors.black;
      case SocialLoginType.facebook:
        return const Color(0xFF4267B2);
      case SocialLoginType.kakaoTalk:
        return const Color(0xFFFEE500);
      case SocialLoginType.line:
        return const Color(0xFF00B900);
    }
  }

  Color _getForegroundColor() {
    switch (type) {
      case SocialLoginType.email:
      case SocialLoginType.apple:
      case SocialLoginType.facebook:
      case SocialLoginType.line:
        return Colors.white;
      case SocialLoginType.google:
      case SocialLoginType.kakaoTalk:
        return Colors.black87;
    }
  }

  BorderSide _getBorderSide() {
    if (type == SocialLoginType.google) {
      return const BorderSide(color: Color(0xFFE5E7EB), width: 1);
    }
    return BorderSide.none;
  }

  Widget _buildIcon() {
    IconData iconData;
    Color iconColor = _getForegroundColor();

    switch (type) {
      case SocialLoginType.email:
        iconData = Icons.email_outlined;
        break;
      case SocialLoginType.google:
        // Using a simple "G" text for Google
        return Container(
          width: 24,
          height: 24,
          decoration: const BoxDecoration(
            shape: BoxShape.circle,
          ),
          child: const Center(
            child: Text(
              'G',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: Color(0xFF4285F4),
              ),
            ),
          ),
        );
      case SocialLoginType.apple:
        iconData = Icons.apple;
        break;
      case SocialLoginType.facebook:
        return Container(
          width: 24,
          height: 24,
          decoration: const BoxDecoration(
            color: Colors.white,
            shape: BoxShape.circle,
          ),
          child: const Center(
            child: Text(
              'f',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: Color(0xFF4267B2),
              ),
            ),
          ),
        );
      case SocialLoginType.kakaoTalk:
        return Container(
          width: 24,
          height: 24,
          decoration: BoxDecoration(
            color: Colors.brown.shade800,
            borderRadius: BorderRadius.circular(6),
          ),
          child: const Center(
            child: Text(
              'K',
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
          ),
        );
      case SocialLoginType.line:
        return Container(
          width: 24,
          height: 24,
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(4),
          ),
          child: const Center(
            child: Text(
              'LINE',
              style: TextStyle(
                fontSize: 8,
                fontWeight: FontWeight.bold,
                color: Color(0xFF00B900),
              ),
            ),
          ),
        );
    }

    return Icon(iconData, size: 24, color: iconColor);
  }

  String _getButtonText() {
    switch (type) {
      case SocialLoginType.email:
        return 'Continue with Email';
      case SocialLoginType.google:
        return 'Continue with Google';
      case SocialLoginType.apple:
        return 'Continue with Apple';
      case SocialLoginType.facebook:
        return 'Continue with Facebook';
      case SocialLoginType.kakaoTalk:
        return 'Continue with KakaoTalk';
      case SocialLoginType.line:
        return 'Continue with LINE';
    }
  }
}
