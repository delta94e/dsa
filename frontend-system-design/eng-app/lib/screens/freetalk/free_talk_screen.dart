import 'package:flutter/material.dart';
import '../../config/theme.dart';

class FreeTalkScreen extends StatelessWidget {
  const FreeTalkScreen({super.key});

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
              const Text(
                'Free Talk',
                style: TextStyle(
                  fontSize: 28,
                  fontWeight: FontWeight.bold,
                  color: AppColors.textPrimary,
                ),
              ),
              const SizedBox(height: 8),
              const Text(
                'Practice conversations with AI',
                style: TextStyle(
                  fontSize: 16,
                  color: AppColors.textSecondary,
                ),
              ),
              
              const SizedBox(height: 32),
              
              // Conversation starters
              Expanded(
                child: ListView(
                  children: [
                    _buildConversationCard(
                      '☕',
                      'Coffee Shop',
                      'Order your favorite drink',
                      const Color(0xFFFEF3C7),
                    ),
                    const SizedBox(height: 16),
                    _buildConversationCard(
                      '🛒',
                      'At the Store',
                      'Ask for help finding items',
                      const Color(0xFFDCFCE7),
                    ),
                    const SizedBox(height: 16),
                    _buildConversationCard(
                      '✈️',
                      'At the Airport',
                      'Check in and get directions',
                      const Color(0xFFDBEAFE),
                    ),
                    const SizedBox(height: 16),
                    _buildConversationCard(
                      '🏨',
                      'Hotel Check-in',
                      'Book a room and ask about amenities',
                      const Color(0xFFFCE7F3),
                    ),
                    const SizedBox(height: 16),
                    _buildConversationCard(
                      '🍽️',
                      'Restaurant',
                      'Order food and make requests',
                      const Color(0xFFFFEDD5),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildConversationCard(
    String emoji,
    String title,
    String description,
    Color backgroundColor,
  ) {
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
              color: backgroundColor,
              borderRadius: BorderRadius.circular(14),
            ),
            child: Center(
              child: Text(emoji, style: const TextStyle(fontSize: 28)),
            ),
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
