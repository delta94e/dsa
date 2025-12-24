import 'package:flutter/material.dart';
import '../../config/theme.dart';
import '../../config/routes.dart';
import '../../widgets/course/expanded_lesson_card.dart';
import '../../widgets/streak/streak_bottom_sheet.dart';

class CourseHomeScreen extends StatefulWidget {
  const CourseHomeScreen({super.key});

  @override
  State<CourseHomeScreen> createState() => _CourseHomeScreenState();
}

class _CourseHomeScreenState extends State<CourseHomeScreen> {
  int _selectedTabIndex = 0;
  final List<String> _tabs = ['Course', 'Practice'];
  int _streakCount = 0;
  LessonType _selectedLessonType = LessonType.video;
  
  // Key to control ExpandedLessonCard
  final GlobalKey<ExpandedLessonCardState> _expandedCardKey = GlobalKey();
  
  // ScrollController to detect scrolling
  late ScrollController _scrollController;

  @override
  void initState() {
    super.initState();
    _scrollController = ScrollController();
    _scrollController.addListener(_onScroll);
  }

  @override
  void dispose() {
    _scrollController.removeListener(_onScroll);
    _scrollController.dispose();
    super.dispose();
  }

  double _scrollStart = 0;
  bool _hasClosedOnScroll = false;

  void _onScroll() {
    // Close card smoothly after scrolling 30px
    if (!_hasClosedOnScroll && _scrollController.offset > _scrollStart + 30) {
      _expandedCardKey.currentState?.collapse();
      _hasClosedOnScroll = true;
    }
    
    // Reset when scroll back to top
    if (_scrollController.offset < 10) {
      _hasClosedOnScroll = false;
      _scrollStart = 0;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF5F7FA),
      body: SafeArea(
        child: Column(
          children: [
            // Header
            _buildHeader(),
            
            // Content
            Expanded(
              child: SingleChildScrollView(
                controller: _scrollController,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Unit header
                    Padding(
                      padding: const EdgeInsets.fromLTRB(20, 16, 20, 0),
                      child: Row(
                        children: [
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'UNIT 1',
                                  style: TextStyle(
                                    fontSize: 13,
                                    fontWeight: FontWeight.w500,
                                    color: AppColors.textSecondary,
                                    letterSpacing: 0.5,
                                  ),
                                ),
                                const SizedBox(height: 2),
                                const Text(
                                  'Cuộc họp',
                                  style: TextStyle(
                                    fontSize: 28,
                                    fontWeight: FontWeight.bold,
                                    color: AppColors.textPrimary,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          // Notes button
                          Container(
                            width: 44,
                            height: 44,
                            decoration: BoxDecoration(
                              color: AppColors.primary,
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: const Icon(
                              Icons.sticky_note_2_outlined,
                              color: Colors.white,
                              size: 22,
                            ),
                          ),
                        ],
                      ),
                    ),
                    
                    const SizedBox(height: 20),
                    
                    // Main lesson card with key
                    ExpandedLessonCard(
                      key: _expandedCardKey,
                      title: 'Cập nhật cho\nnhóm của bạn',
                      avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
                      questionText: "What's on your plate this week?",
                      selectedType: _selectedLessonType,
                      onTypeSelected: (type) {
                        setState(() {
                          _selectedLessonType = type;
                        });
                      },
                      onStart: () {
                        Navigator.pushNamed(context, AppRoutes.videoLesson);
                      },
                    ),
                    
                    const SizedBox(height: 20),
                    
                    // Other lessons
                    _buildLessonRow(
                      'Gặp gỡ khách hàng',
                      'https://randomuser.me/api/portraits/men/32.jpg',
                    ),
                    
                    const SizedBox(height: 12),
                    
                    _buildLessonRow(
                      'Lên lịch cuộc họp',
                      'https://randomuser.me/api/portraits/women/68.jpg',
                    ),
                    
                    const SizedBox(height: 12),
                    
                    _buildLessonRow(
                      'Thảo luận dự án',
                      'https://randomuser.me/api/portraits/men/45.jpg',
                    ),
                    
                    const SizedBox(height: 12),
                    
                    _buildLessonRow(
                      'Báo cáo tiến độ',
                      'https://randomuser.me/api/portraits/women/23.jpg',
                    ),
                    
                    const SizedBox(height: 12),
                    
                    _buildLessonRow(
                      'Giải quyết vấn đề',
                      'https://randomuser.me/api/portraits/men/67.jpg',
                    ),
                    
                    const SizedBox(height: 12),
                    
                    _buildLessonRow(
                      'Đưa ra quyết định',
                      'https://randomuser.me/api/portraits/women/89.jpg',
                    ),
                    
                    const SizedBox(height: 32),
                    
                    // Unit 2
                    Padding(
                      padding: const EdgeInsets.fromLTRB(20, 0, 20, 0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'UNIT 2',
                            style: TextStyle(
                              fontSize: 13,
                              fontWeight: FontWeight.w500,
                              color: AppColors.textSecondary,
                              letterSpacing: 0.5,
                            ),
                          ),
                          const SizedBox(height: 2),
                          const Text(
                            'Công việc hàng ngày',
                            style: TextStyle(
                              fontSize: 28,
                              fontWeight: FontWeight.bold,
                              color: AppColors.textPrimary,
                            ),
                          ),
                        ],
                      ),
                    ),
                    
                    const SizedBox(height: 20),
                    
                    _buildLessonRow(
                      'Bắt đầu ngày mới',
                      'https://randomuser.me/api/portraits/men/12.jpg',
                      isLocked: true,
                    ),
                    
                    const SizedBox(height: 12),
                    
                    _buildLessonRow(
                      'Email và tin nhắn',
                      'https://randomuser.me/api/portraits/women/56.jpg',
                      isLocked: true,
                    ),
                    
                    const SizedBox(height: 12),
                    
                    _buildLessonRow(
                      'Làm việc nhóm',
                      'https://randomuser.me/api/portraits/men/78.jpg',
                      isLocked: true,
                    ),
                    
                    const SizedBox(height: 12),
                    
                    _buildLessonRow(
                      'Nghỉ trưa',
                      'https://randomuser.me/api/portraits/women/34.jpg',
                      isLocked: true,
                    ),
                    
                    const SizedBox(height: 120),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildLessonRow(String title, String avatarUrl, {bool isLocked = false}) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: Opacity(
        opacity: isLocked ? 0.5 : 1.0,
        child: Row(
          children: [
            // Avatar
            Stack(
              children: [
                Container(
                  width: 48,
                  height: 48,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    border: Border.all(color: Colors.grey.shade300, width: 2),
                  ),
                  child: ClipOval(
                    child: Image.network(
                      avatarUrl,
                      fit: BoxFit.cover,
                      errorBuilder: (_, __, ___) => Container(
                        color: Colors.grey[200],
                        child: const Icon(Icons.person, color: Colors.grey),
                      ),
                    ),
                  ),
                ),
                if (isLocked)
                  Positioned(
                    right: 0,
                    bottom: 0,
                    child: Container(
                      width: 18,
                      height: 18,
                      decoration: BoxDecoration(
                        color: Colors.grey.shade400,
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(
                        Icons.lock,
                        size: 10,
                        color: Colors.white,
                      ),
                    ),
                  ),
              ],
            ),
            const SizedBox(width: 12),
            
            // Title bubble
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.04),
                    blurRadius: 8,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: Text(
                title,
                style: const TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.w500,
                  color: AppColors.textPrimary,
                  height: 1.3,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildHeader() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
      color: Colors.white,
      child: Row(
        children: [
          // Level dropdown - tap to select level
          GestureDetector(
            onTap: () {
              Navigator.pushNamed(context, AppRoutes.selectLevel);
            },
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: Colors.grey.shade300),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Text(
                    'Level',
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w500,
                      color: AppColors.textPrimary,
                    ),
                  ),
                  const SizedBox(width: 4),
                  Icon(
                    Icons.keyboard_arrow_down,
                    size: 18,
                    color: Colors.grey.shade600,
                  ),
                ],
              ),
            ),
          ),
          
          const SizedBox(width: 16),
          
          // Course / Practice tabs
          Expanded(
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: _tabs.asMap().entries.map((entry) {
                final isSelected = entry.key == _selectedTabIndex;
                return GestureDetector(
                  onTap: () {
                    setState(() {
                      _selectedTabIndex = entry.key;
                    });
                  },
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 8),
                    child: Text(
                      entry.value,
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                        color: isSelected ? AppColors.textPrimary : AppColors.textSecondary,
                      ),
                    ),
                  ),
                );
              }).toList(),
            ),
          ),
          
          const SizedBox(width: 16),
          
          // Streak counter - tap to show streak sheet
          GestureDetector(
            onTap: () {
              StreakBottomSheet.show(context);
            },
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(
                  Icons.local_fire_department,
                  size: 20,
                  color: Color(0xFFFF6B35),
                ),
                const SizedBox(width: 4),
                Text(
                  '$_streakCount',
                  style: const TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.w600,
                    color: AppColors.textPrimary,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
