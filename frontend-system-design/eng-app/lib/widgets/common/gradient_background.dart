import 'package:flutter/material.dart';
import '../../config/theme.dart';

class GradientBackground extends StatelessWidget {
  final Widget child;

  const GradientBackground({
    super.key,
    required this.child,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [
            Colors.white,
            Colors.white,
            Color(0xFFE0F7FA),
            Color(0xFFB2EBF2),
          ],
          stops: [0.0, 0.5, 0.8, 1.0],
        ),
      ),
      child: child,
    );
  }
}
