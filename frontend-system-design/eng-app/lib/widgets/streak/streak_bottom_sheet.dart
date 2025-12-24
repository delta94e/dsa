import 'package:flutter/material.dart';
import '../../config/theme.dart';

class StreakBottomSheet extends StatefulWidget {
  final int dayStreak;
  final int weeksInRow;
  final int longestDailyStreak;
  final int longestWeeklyStreak;
  final int streakFreeze;

  const StreakBottomSheet({
    super.key,
    this.dayStreak = 0,
    this.weeksInRow = 0,
    this.longestDailyStreak = 4,
    this.longestWeeklyStreak = 2,
    this.streakFreeze = 0,
  });

  static void show(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => DraggableScrollableSheet(
        initialChildSize: 0.85,
        minChildSize: 0.5,
        maxChildSize: 0.95,
        builder: (context, scrollController) => Container(
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
          ),
          child: const StreakBottomSheet(),
        ),
      ),
    );
  }

  @override
  State<StreakBottomSheet> createState() => _StreakBottomSheetState();
}

class _StreakBottomSheetState extends State<StreakBottomSheet> {
  late DateTime _currentMonth;
  late int _selectedDay;

  @override
  void initState() {
    super.initState();
    _currentMonth = DateTime.now();
    _selectedDay = DateTime.now().day;
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Column(
        children: [
          // Drag indicator
          Container(
            width: 40,
            height: 4,
            decoration: BoxDecoration(
              color: Colors.grey.shade300,
              borderRadius: BorderRadius.circular(2),
            ),
          ),
          
          const SizedBox(height: 20),
          
          // Header
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Text(
                'Streak',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w600,
                  color: AppColors.textPrimary,
                ),
              ),
              const SizedBox(width: 8),
              Icon(
                Icons.info_outline,
                size: 18,
                color: Colors.grey.shade400,
              ),
            ],
          ),
          
          const SizedBox(height: 24),
          
          // Title
          Text(
            widget.dayStreak == 0 ? 'Start a Streak!' : 'Keep it up!',
            style: const TextStyle(
              fontSize: 28,
              fontWeight: FontWeight.bold,
              color: AppColors.textPrimary,
            ),
          ),
          
          const SizedBox(height: 8),
          
          Text(
            widget.dayStreak == 0 
              ? 'Do just one lesson to start a streak!'
              : 'You\'re on fire! Keep learning every day.',
            style: TextStyle(
              fontSize: 16,
              color: Colors.grey.shade600,
            ),
          ),
          
          const SizedBox(height: 32),
          
          // Divider
          Container(height: 1, color: Colors.grey.shade200),
          
          const SizedBox(height: 24),
          
          // Stats row
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              _buildStatItem('${widget.dayStreak}', 'DAY\nSTREAK'),
              // Fire icon
              Container(
                width: 80,
                height: 80,
                decoration: BoxDecoration(
                  gradient: RadialGradient(
                    colors: [
                      Colors.orange.shade100,
                      Colors.transparent,
                    ],
                  ),
                ),
                child: const Center(
                  child: Text(
                    '🔥',
                    style: TextStyle(fontSize: 48),
                  ),
                ),
              ),
              _buildStatItem('${widget.weeksInRow}', 'WEEKS\nIN A ROW'),
            ],
          ),
          
          const SizedBox(height: 32),
          
          // Calendar
          _buildCalendar(),
          
          const SizedBox(height: 24),
          
          // Streak freeze
          _buildStreakFreeze(),
          
          const SizedBox(height: 24),
          
          // Divider
          Container(height: 1, color: Colors.grey.shade200),
          
          const SizedBox(height: 24),
          
          // Your Records
          const Text(
            'Your Records',
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: AppColors.textPrimary,
            ),
          ),
          
          const SizedBox(height: 20),
          
          // Records
          _buildRecordItem('🔥', '${widget.longestDailyStreak} days', 'Longest Daily Streak'),
          const SizedBox(height: 16),
          _buildRecordItem('📅', '${widget.longestWeeklyStreak} weeks', 'Longest Weekly Streak'),
          
          const SizedBox(height: 40),
        ],
      ),
    );
  }

  Widget _buildStatItem(String value, String label) {
    return Column(
      children: [
        Text(
          value,
          style: TextStyle(
            fontSize: 32,
            fontWeight: FontWeight.w300,
            color: Colors.grey.shade400,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          label,
          textAlign: TextAlign.center,
          style: TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.w500,
            color: Colors.grey.shade500,
            height: 1.3,
          ),
        ),
      ],
    );
  }

  Widget _buildCalendar() {
    return Column(
      children: [
        // Month navigation
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            IconButton(
              icon: Icon(Icons.chevron_left, color: Colors.grey.shade600),
              onPressed: () {
                setState(() {
                  _currentMonth = DateTime(_currentMonth.year, _currentMonth.month - 1);
                });
              },
            ),
            Text(
              _getMonthName(_currentMonth.month),
              style: const TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w600,
                color: AppColors.textPrimary,
              ),
            ),
            IconButton(
              icon: Icon(Icons.chevron_right, color: Colors.grey.shade600),
              onPressed: () {
                setState(() {
                  _currentMonth = DateTime(_currentMonth.year, _currentMonth.month + 1);
                });
              },
            ),
          ],
        ),
        
        const SizedBox(height: 16),
        
        // Week days header
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: ['M', 'T', 'W', 'T', 'F', 'S', 'S']
              .map((day) => SizedBox(
                    width: 40,
                    child: Text(
                      day,
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w500,
                        color: Colors.grey.shade500,
                      ),
                    ),
                  ))
              .toList(),
        ),
        
        const SizedBox(height: 12),
        
        // Calendar grid
        _buildCalendarGrid(),
      ],
    );
  }

  Widget _buildCalendarGrid() {
    final daysInMonth = DateTime(_currentMonth.year, _currentMonth.month + 1, 0).day;
    final firstWeekday = DateTime(_currentMonth.year, _currentMonth.month, 1).weekday;
    final today = DateTime.now();
    
    List<Widget> rows = [];
    List<Widget> currentRow = [];
    
    // Empty cells for days before the 1st
    for (int i = 1; i < firstWeekday; i++) {
      currentRow.add(const SizedBox(width: 40, height: 40));
    }
    
    for (int day = 1; day <= daysInMonth; day++) {
      final isToday = _currentMonth.year == today.year && 
                      _currentMonth.month == today.month && 
                      day == today.day;
      
      currentRow.add(
        Container(
          width: 40,
          height: 40,
          decoration: BoxDecoration(
            color: isToday ? Colors.grey.shade200 : null,
            shape: BoxShape.circle,
          ),
          child: Center(
            child: Text(
              '$day',
              style: TextStyle(
                fontSize: 15,
                fontWeight: isToday ? FontWeight.w600 : FontWeight.w400,
                color: AppColors.textPrimary,
              ),
            ),
          ),
        ),
      );
      
      if (currentRow.length == 7) {
        rows.add(
          Padding(
            padding: const EdgeInsets.only(bottom: 8),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: currentRow,
            ),
          ),
        );
        currentRow = [];
      }
    }
    
    // Add remaining days
    if (currentRow.isNotEmpty) {
      while (currentRow.length < 7) {
        currentRow.add(const SizedBox(width: 40, height: 40));
      }
      rows.add(
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: currentRow,
        ),
      );
    }
    
    return Column(children: rows);
  }

  Widget _buildStreakFreeze() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.grey.shade50,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        children: [
          // Ice icon
          Container(
            width: 48,
            height: 48,
            decoration: BoxDecoration(
              color: Colors.blue.shade50,
              borderRadius: BorderRadius.circular(12),
            ),
            child: const Center(
              child: Text('🧊', style: TextStyle(fontSize: 24)),
            ),
          ),
          const SizedBox(width: 16),
          const Expanded(
            child: Text(
              'Streak freeze',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w600,
                color: AppColors.textPrimary,
              ),
            ),
          ),
          Text(
            '${widget.streakFreeze}',
            style: const TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.w600,
              color: AppColors.textPrimary,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildRecordItem(String emoji, String value, String label) {
    return Row(
      children: [
        Container(
          width: 48,
          height: 48,
          decoration: BoxDecoration(
            color: Colors.orange.shade50,
            borderRadius: BorderRadius.circular(12),
          ),
          child: Center(
            child: Text(emoji, style: const TextStyle(fontSize: 24)),
          ),
        ),
        const SizedBox(width: 16),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              value,
              style: const TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: AppColors.textPrimary,
              ),
            ),
            Text(
              label,
              style: TextStyle(
                fontSize: 14,
                color: Colors.grey.shade600,
              ),
            ),
          ],
        ),
      ],
    );
  }

  String _getMonthName(int month) {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[month - 1];
  }
}
