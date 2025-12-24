import 'package:flutter/material.dart';
import '../../config/theme.dart';

class PracticeScreen extends StatelessWidget {
  const PracticeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header
              const Text(
                'Practice',
                style: TextStyle(
                  fontSize: 28,
                  fontWeight: FontWeight.bold,
                  color: AppColors.textPrimary,
                ),
              ),
              const SizedBox(height: 8),
              const Text(
                'Improve your speaking skills',
                style: TextStyle(
                  fontSize: 16,
                  color: AppColors.textSecondary,
                ),
              ),
              
              const SizedBox(height: 32),
              
              // Practice cards
              _buildPracticeCard(
                icon: Icons.mic,
                title: 'Speaking Practice',
                description: 'Practice pronunciation with AI feedback',
                color: const Color(0xFF10B981),
              ),
              
              const SizedBox(height: 16),
              
              _buildPracticeCard(
                icon: Icons.headphones,
                title: 'Listening Exercises',
                description: 'Improve comprehension with audio lessons',
                color: const Color(0xFF8B5CF6),
              ),
              
              const SizedBox(height: 16),
              
              _buildPracticeCard(
                icon: Icons.chat_bubble_outline,
                title: 'Conversation Mode',
                description: 'Have real conversations with AI tutor',
                color: const Color(0xFFF97316),
              ),
              
              const SizedBox(height: 16),
              
              _buildPracticeCard(
                icon: Icons.quiz_outlined,
                title: 'Quick Quiz',
                description: 'Test your knowledge with fun quizzes',
                color: const Color(0xFFEC4899),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildPracticeCard({
    required IconData icon,
    required String title,
    required String description,
    required Color color,
  }) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            width: 56,
            height: 56,
            decoration: BoxDecoration(
              color: color.withOpacity(0.1),
              borderRadius: BorderRadius.circular(14),
            ),
            child: Icon(icon, color: color, size: 28),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: AppColors.textPrimary,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  description,
                  style: const TextStyle(
                    fontSize: 14,
                    color: AppColors.textSecondary,
                  ),
                ),
              ],
            ),
          ),
          const Icon(
            Icons.chevron_right,
            color: AppColors.textSecondary,
          ),
        ],
      ),
    );
  }
}
