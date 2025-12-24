import 'package:flutter/material.dart';
import '../../config/theme.dart';
import '../../config/routes.dart';

class PremiumUpsellScreen extends StatelessWidget {
  const PremiumUpsellScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Column(
          children: [
            // Header with close button
            Padding(
              padding: const EdgeInsets.all(16),
              child: Row(
                children: [
                  GestureDetector(
                    onTap: () => Navigator.pop(context),
                    child: const Icon(
                      Icons.close,
                      size: 28,
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
                    // Title
                    RichText(
                      textAlign: TextAlign.center,
                      text: const TextSpan(
                        style: TextStyle(
                          fontSize: 28,
                          fontWeight: FontWeight.bold,
                          color: AppColors.textPrimary,
                          height: 1.3,
                        ),
                        children: [
                          TextSpan(text: 'Speak '),
                          TextSpan(
                            text: '1000+',
                            style: TextStyle(color: AppColors.primary),
                          ),
                          TextSpan(text: ' phrases'),
                        ],
                      ),
                    ),
                    const SizedBox(height: 8),
                    const Text(
                      'in the first 7 days with Speak Premium',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 16,
                        color: AppColors.textSecondary,
                      ),
                    ),

                    const SizedBox(height: 32),

                    // Progress chart
                    _buildProgressChart(),

                    const SizedBox(height: 40),

                    // Benefits section
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(24),
                      decoration: BoxDecoration(
                        color: AppColors.surfaceSecondary,
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'OUR TOP PLAN INCLUDES',
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.w600,
                              color: AppColors.textSecondary,
                              letterSpacing: 1,
                            ),
                          ),
                          const SizedBox(height: 20),
                          _buildBenefitItem(
                            Icons.campaign,
                            "The world's most advanced speaking curriculum",
                          ),
                          _buildBenefitItem(
                            Icons.auto_fix_high,
                            'Lessons to target your frequent mistakes',
                          ),
                          _buildBenefitItem(
                            Icons.translate,
                            'Vocabulary for your interests',
                          ),
                          _buildBenefitItem(
                            Icons.forum,
                            'Situational roleplays',
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 32),
                  ],
                ),
              ),
            ),

            // Bottom CTA
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: Colors.white,
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.05),
                    blurRadius: 10,
                    offset: const Offset(0, -2),
                  ),
                ],
              ),
              child: SafeArea(
                child: SizedBox(
                  width: double.infinity,
                  height: 56,
                  child: ElevatedButton.icon(
                    onPressed: () {
                      Navigator.pushNamed(context, AppRoutes.subscription);
                    },
                    icon: const Icon(Icons.workspace_premium),
                    label: const Text(
                      'Check out plans',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.primary,
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(28),
                      ),
                      elevation: 0,
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildProgressChart() {
    return Container(
      height: 200,
      padding: const EdgeInsets.all(20),
      child: CustomPaint(
        size: const Size(double.infinity, 160),
        painter: _ChartPainter(),
        child: Stack(
          children: [
            // 1000 phrases badge
            Positioned(
              left: 20,
              top: 20,
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                decoration: BoxDecoration(
                  color: AppColors.primary,
                  borderRadius: BorderRadius.circular(20),
                ),
                child: const Column(
                  children: [
                    Text(
                      '1,000',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                    Text(
                      'phrases',
                      style: TextStyle(
                        fontSize: 12,
                        color: Colors.white70,
                      ),
                    ),
                  ],
                ),
              ),
            ),
            
            // Speak label
            Positioned(
              right: 80,
              top: 30,
              child: Text(
                'Speak',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                  color: AppColors.primary,
                ),
              ),
            ),
            
            // "by yourself" label
            Positioned(
              right: 40,
              bottom: 40,
              child: Text(
                'by\nyourself',
                style: TextStyle(
                  fontSize: 12,
                  color: AppColors.textSecondary,
                ),
              ),
            ),
            
            // Day labels
            const Positioned(
              left: 20,
              bottom: 10,
              child: Text(
                'DAY 0',
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w500,
                  color: AppColors.textSecondary,
                ),
              ),
            ),
            const Positioned(
              right: 20,
              bottom: 10,
              child: Text(
                'DAY 7',
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w500,
                  color: AppColors.textSecondary,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildBenefitItem(IconData icon, String text) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, size: 24, color: AppColors.primary),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              text,
              style: const TextStyle(
                fontSize: 15,
                fontWeight: FontWeight.w500,
                color: AppColors.textPrimary,
                height: 1.4,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _ChartPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = const Color(0xFF2563EB)
      ..strokeWidth = 3
      ..style = PaintingStyle.stroke;

    final path = Path();
    
    // Draw exponential curve for "Speak"
    path.moveTo(40, size.height - 40);
    path.quadraticBezierTo(
      size.width * 0.4,
      size.height - 60,
      size.width - 60,
      40,
    );
    
    canvas.drawPath(path, paint);
    
    // Draw arrow at end
    final arrowPaint = Paint()
      ..color = const Color(0xFF2563EB)
      ..strokeWidth = 2
      ..style = PaintingStyle.stroke;
    
    canvas.drawLine(
      Offset(size.width - 60, 40),
      Offset(size.width - 70, 50),
      arrowPaint,
    );
    canvas.drawLine(
      Offset(size.width - 60, 40),
      Offset(size.width - 50, 50),
      arrowPaint,
    );
    
    // Draw flat line for "by yourself"
    final grayPaint = Paint()
      ..color = Colors.grey.shade400
      ..strokeWidth = 2
      ..style = PaintingStyle.stroke;
    
    final grayPath = Path();
    grayPath.moveTo(40, size.height - 40);
    grayPath.quadraticBezierTo(
      size.width * 0.5,
      size.height - 50,
      size.width - 60,
      size.height - 60,
    );
    
    canvas.drawPath(grayPath, grayPaint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
