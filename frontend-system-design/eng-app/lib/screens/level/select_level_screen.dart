import 'package:flutter/material.dart';
import '../../config/theme.dart';

class SelectLevelScreen extends StatefulWidget {
  const SelectLevelScreen({super.key});

  @override
  State<SelectLevelScreen> createState() => _SelectLevelScreenState();
}

class _SelectLevelScreenState extends State<SelectLevelScreen> {
  String? _selectedLevel;

  // Level data structure
  final List<LevelSection> _sections = [
    LevelSection(
      icon: '📊',
      title: 'Nâng cao',
      code: 'C1',
      description: 'Có thể diễn đạt thật tự nhiên với vốn ngôn ngữ phong phú và tinh tế.',
      levels: [
        LevelItem(
          title: 'Nâng cao',
          code: 'C1',
          description: 'Trau dồi giao tiếp: bày tỏ quan điểm với sự tôn trọng, kỹ năng thương lượng tinh tế.',
        ),
      ],
    ),
    LevelSection(
      icon: '📊',
      title: 'Trung cấp',
      code: 'B1',
      description: 'Có thể chia sẻ về trải nghiệm và trao đổi về nhiều chủ đề một cách tự tin.',
      levels: [
        LevelItem(
          title: 'Trung cấp',
          code: 'B1',
          description: 'Tự tin thể hiện bản thân: Chia sẻ ý kiến, đưa ra quyết định và đưa ra lời khuyên.',
        ),
      ],
    ),
    LevelSection(
      icon: '📊',
      title: 'Trung cao cấp',
      code: 'B2',
      description: 'Có thể diễn đạt hiệu quả về các chủ đề trừu tượng hoặc mang tính kỹ thuật.',
      levels: [
        LevelItem(
          title: 'Trung cao cấp phần 1',
          code: 'B2',
          description: 'Đi sâu: Diễn đạt quan điểm, so sánh ưu và nhược điểm, và tranh luận như người bản xứ.',
        ),
      ],
    ),
  ];

  final LevelSection _customSection = LevelSection(
    icon: '🎯',
    title: 'Tự chọn',
    code: '',
    description: 'Khóa học mở rộng ngoài lộ trình học tập chính cho các cấp độ thành thạo khác nhau.',
    levels: [
      LevelItem(
        title: 'Tiếng Anh thương mại',
        code: 'B2',
        description: 'Nâng cấp: Thảo luận với đồng nghiệp, thuyết trình và chinh phục các cuộc phỏng vấn.',
      ),
    ],
  );

  final List<LevelItem> _specialCourses = [
    LevelItem(
      title: '[Speak x T1] Tư Duy Nhà Vô Địch',
      code: 'A2',
      description: 'Khóa học "chữa lành" kết hợp tiếng Anh và nuôi dưỡng "tư duy chiến thắng" cùng nhà vô địch eSports Faker và T1, giúp bạn vượt qua áp lực, nuôi dưỡng tinh thần chiến thắng và phát triển bản thân.',
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.close, color: Colors.black),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text(
          'Select your level',
          style: TextStyle(
            color: Colors.black,
            fontSize: 17,
            fontWeight: FontWeight.w600,
          ),
        ),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 20),
        child: Column(
          children: [
            const SizedBox(height: 20),
            
            // Custom section first
            _buildSectionHeader(_customSection),
            const SizedBox(height: 16),
            ..._customSection.levels.map((level) => _buildLevelCard(level, isSelected: _selectedLevel == level.title)),
            
            const SizedBox(height: 32),
            
            // Special courses section
            const Text(
              'Khóa học đặc biệt',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: AppColors.textPrimary,
              ),
            ),
            const SizedBox(height: 8),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Text('🔥', style: TextStyle(fontSize: 18)),
                const SizedBox(width: 8),
                // Wrap in Flexible to prevent overflow
                Flexible(
                  child: Text(
                    'Các phiên bản đặc biệt mà bạn không muốn bỏ lỡ',
                    style: TextStyle(
                      fontSize: 14,
                      color: Colors.grey.shade600,
                    ),
                    textAlign: TextAlign.center,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            ..._specialCourses.map((course) => _buildLevelCard(course)),
            
            const SizedBox(height: 32),
            
            // Main level sections
            ..._sections.map((section) => _buildFullSection(section)),
            
            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }

  Widget _buildSectionHeader(LevelSection section) {
    return Column(
      children: [
        // Level indicator bars
        if (section.code.isNotEmpty)
          _buildLevelIndicator(section.code),
        
        if (section.code.isNotEmpty)
          const SizedBox(height: 16),
        
        Text(
          section.title,
          style: const TextStyle(
            fontSize: 28,
            fontWeight: FontWeight.bold,
            color: AppColors.textPrimary,
          ),
        ),
        const SizedBox(height: 8),
        Text(
          section.description,
          textAlign: TextAlign.center,
          style: TextStyle(
            fontSize: 15,
            color: Colors.grey.shade600,
            height: 1.4,
          ),
        ),
      ],
    );
  }

  Widget _buildLevelIndicator(String code) {
    // Determine number of bars based on level
    int filledBars = 3;
    if (code == 'A1' || code == 'A2') filledBars = 1;
    if (code == 'B1') filledBars = 2;
    if (code == 'B2') filledBars = 3;
    if (code == 'C1' || code == 'C2') filledBars = 4;
    
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: List.generate(5, (index) {
        final isFilled = index < filledBars;
        final height = 12.0 + (index * 4);
        return Container(
          margin: const EdgeInsets.symmetric(horizontal: 2),
          width: 8,
          height: height,
          decoration: BoxDecoration(
            color: isFilled ? AppColors.primary : Colors.grey.shade300,
            borderRadius: BorderRadius.circular(4),
          ),
        );
      }),
    );
  }

  Widget _buildLevelCard(LevelItem level, {bool isSelected = false}) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: isSelected ? AppColors.primary : Colors.grey.shade200,
          width: isSelected ? 2 : 1,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Text(
                  level.title,
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: AppColors.textPrimary,
                  ),
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                decoration: BoxDecoration(
                  color: Colors.grey.shade100,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  level.code,
                  style: TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                    color: Colors.grey.shade600,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            level.description,
            style: TextStyle(
              fontSize: 15,
              color: Colors.grey.shade600,
              height: 1.4,
            ),
          ),
          const SizedBox(height: 16),
          
          // Select or Continue button
          if (isSelected)
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () {
                  // Continue with selected level
                  Navigator.pop(context, level);
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primary,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  elevation: 0,
                ),
                child: const Text(
                  'Continue',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            )
          else
            GestureDetector(
              onTap: () {
                setState(() {
                  _selectedLevel = level.title;
                });
              },
              child: Text(
                'Select',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                  color: AppColors.primary,
                ),
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildFullSection(LevelSection section) {
    return Column(
      children: [
        const SizedBox(height: 24),
        _buildSectionHeader(section),
        const SizedBox(height: 16),
        ...section.levels.map((level) => _buildLevelCard(level, isSelected: _selectedLevel == level.title)),
      ],
    );
  }
}

// Data models
class LevelSection {
  final String icon;
  final String title;
  final String code;
  final String description;
  final List<LevelItem> levels;

  LevelSection({
    required this.icon,
    required this.title,
    required this.code,
    required this.description,
    required this.levels,
  });
}

class LevelItem {
  final String title;
  final String code;
  final String description;

  LevelItem({
    required this.title,
    required this.code,
    required this.description,
  });
}
