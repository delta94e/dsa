import 'package:flutter/material.dart';
import '../../config/theme.dart';

class SubscriptionScreen extends StatefulWidget {
  const SubscriptionScreen({super.key});

  @override
  State<SubscriptionScreen> createState() => _SubscriptionScreenState();
}

class _SubscriptionScreenState extends State<SubscriptionScreen> {
  int _selectedPlanIndex = 0;
  bool _showComparison = false;

  final List<SubscriptionPlan> _plans = [
    SubscriptionPlan(
      name: 'Premium',
      description: 'The language curriculum that gets you speaking from Day 1',
      yearlyPrice: 1299000,
      monthlyPrice: 108250,
      features: [
        'Speak curriculum',
        'Roleplay',
        'Ask Speak Tutor',
        'Pronunciation coach',
      ],
    ),
    SubscriptionPlan(
      name: 'Premium Plus',
      description: "The world's most powerful language tutor, with curriculum made for you",
      yearlyPrice: 2349000,
      monthlyPrice: 195750,
      isBestValue: true,
      features: [
        'Speak curriculum',
        'Roleplay',
        'Ask Speak Tutor',
        'Pronunciation coach',
        'Personalized study plan',
        'Target your mistakes',
        'Interest based lessons',
      ],
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Column(
          children: [
            // Header with back button
            Padding(
              padding: const EdgeInsets.all(16),
              child: Row(
                children: [
                  GestureDetector(
                    onTap: () => Navigator.pop(context),
                    child: const Icon(
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
                    // Title
                    RichText(
                      textAlign: TextAlign.center,
                      text: const TextSpan(
                        style: TextStyle(
                          fontSize: 26,
                          fontWeight: FontWeight.bold,
                          color: AppColors.textPrimary,
                          height: 1.3,
                        ),
                        children: [
                          TextSpan(text: 'Join over '),
                          TextSpan(
                            text: '5 million',
                            style: TextStyle(color: AppColors.primary),
                          ),
                          TextSpan(text: ' users who already learn with Speak!'),
                        ],
                      ),
                    ),

                    const SizedBox(height: 32),

                    // Plan cards
                    ...List.generate(_plans.length, (index) {
                      return Padding(
                        padding: const EdgeInsets.only(bottom: 16),
                        child: _buildPlanCard(_plans[index], index),
                      );
                    }),

                    const SizedBox(height: 16),

                    // Comparison toggle
                    if (_showComparison) _buildComparisonTable(),

                    const SizedBox(height: 24),
                  ],
                ),
              ),
            ),

            // Bottom section
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
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    // Price info
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          '₫${_formatPrice(_plans[_selectedPlanIndex].yearlyPrice)}',
                          style: const TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                            color: AppColors.textPrimary,
                          ),
                        ),
                        const Text(
                          ' / year. Cancel anytime.',
                          style: TextStyle(
                            fontSize: 14,
                            color: AppColors.textSecondary,
                          ),
                        ),
                      ],
                    ),
                    
                    const SizedBox(height: 16),
                    
                    // Subscribe button
                    SizedBox(
                      width: double.infinity,
                      height: 56,
                      child: ElevatedButton.icon(
                        onPressed: () {
                          // TODO: Handle subscription
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(content: Text('Subscription coming soon!')),
                          );
                        },
                        icon: const Icon(Icons.workspace_premium),
                        label: const Text(
                          'Subscribe',
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
                    
                    const SizedBox(height: 12),
                    
                    // View more plans
                    GestureDetector(
                      onTap: () {
                        setState(() {
                          _showComparison = !_showComparison;
                        });
                      },
                      child: Text(
                        _showComparison ? 'Hide Comparison' : 'View More Plans',
                        style: const TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w600,
                          color: AppColors.primary,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPlanCard(SubscriptionPlan plan, int index) {
    final isSelected = _selectedPlanIndex == index;
    
    return GestureDetector(
      onTap: () {
        setState(() {
          _selectedPlanIndex = index;
        });
      },
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          border: Border.all(
            color: isSelected ? AppColors.primary : AppColors.border,
            width: isSelected ? 2 : 1,
          ),
          borderRadius: BorderRadius.circular(16),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Best value badge
            if (plan.isBestValue)
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                margin: const EdgeInsets.only(bottom: 12),
                decoration: BoxDecoration(
                  color: AppColors.textPrimary,
                  borderRadius: BorderRadius.circular(6),
                ),
                child: const Text(
                  'BEST VALUE',
                  style: TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.w700,
                    color: Colors.white,
                    letterSpacing: 0.5,
                  ),
                ),
              ),
            
            // Header row
            Row(
              children: [
                Expanded(
                  child: Text(
                    plan.name,
                    style: TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.bold,
                      color: plan.isBestValue ? AppColors.primary : AppColors.textPrimary,
                    ),
                  ),
                ),
                if (isSelected)
                  const Icon(
                    Icons.check,
                    color: AppColors.textPrimary,
                    size: 24,
                  ),
              ],
            ),
            
            const SizedBox(height: 8),
            
            // Description
            Text(
              plan.description,
              style: const TextStyle(
                fontSize: 14,
                color: AppColors.textSecondary,
                height: 1.4,
              ),
            ),
            
            const SizedBox(height: 12),
            
            const Divider(),
            
            const SizedBox(height: 8),
            
            // Pricing
            Row(
              children: [
                Text(
                  'Billed ₫${_formatPrice(plan.yearlyPrice)} / year',
                  style: const TextStyle(
                    fontSize: 14,
                    color: AppColors.textSecondary,
                  ),
                ),
                const SizedBox(width: 12),
                Text(
                  '₫${_formatPrice(plan.monthlyPrice)} / month',
                  style: const TextStyle(
                    fontSize: 14,
                    color: AppColors.textSecondary,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildComparisonTable() {
    final features = [
      'Speak curriculum',
      'Roleplay',
      'Ask Speak Tutor',
      'Pronunciation coach',
      'Personalized study plan',
      'Target your mistakes',
      'Interest based lessons',
    ];
    
    final premiumFeatures = [true, true, true, true, false, false, false];
    final premiumPlusFeatures = [true, true, true, true, true, true, true];
    
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppColors.surfaceSecondary,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        children: [
          // Header row
          Row(
            children: [
              const Expanded(flex: 2, child: SizedBox()),
              const Expanded(
                child: Center(
                  child: Text(
                    'Premium',
                    style: TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w600,
                      color: AppColors.textSecondary,
                    ),
                  ),
                ),
              ),
              Expanded(
                child: Center(
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: AppColors.primary.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: const Text(
                      'Premium+',
                      style: TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w600,
                        color: AppColors.primary,
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ),
          
          const SizedBox(height: 16),
          
          // Feature rows
          ...List.generate(features.length, (index) {
            return Padding(
              padding: const EdgeInsets.symmetric(vertical: 12),
              child: Row(
                children: [
                  Expanded(
                    flex: 2,
                    child: Text(
                      features[index],
                      style: const TextStyle(
                        fontSize: 14,
                        color: AppColors.textPrimary,
                      ),
                    ),
                  ),
                  Expanded(
                    child: Center(
                      child: premiumFeatures[index]
                          ? const Icon(Icons.check, color: AppColors.textPrimary, size: 20)
                          : const Text('—', style: TextStyle(color: AppColors.textMuted)),
                    ),
                  ),
                  Expanded(
                    child: Center(
                      child: Icon(
                        Icons.check,
                        color: premiumPlusFeatures[index] ? AppColors.primary : AppColors.textMuted,
                        size: 20,
                      ),
                    ),
                  ),
                ],
              ),
            );
          }),
          
          const SizedBox(height: 16),
          
          // Rating
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: List.generate(5, (index) => const Icon(
              Icons.star,
              color: AppColors.textPrimary,
              size: 24,
            )),
          ),
        ],
      ),
    );
  }

  String _formatPrice(int price) {
    return price.toString().replaceAllMapped(
      RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'),
      (Match m) => '${m[1]}.',
    );
  }
}

class SubscriptionPlan {
  final String name;
  final String description;
  final int yearlyPrice;
  final int monthlyPrice;
  final bool isBestValue;
  final List<String> features;

  SubscriptionPlan({
    required this.name,
    required this.description,
    required this.yearlyPrice,
    required this.monthlyPrice,
    this.isBestValue = false,
    required this.features,
  });
}
