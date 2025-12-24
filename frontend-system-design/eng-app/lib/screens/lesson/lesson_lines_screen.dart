import 'package:flutter/material.dart';
import '../../config/theme.dart';

class LessonLinesScreen extends StatelessWidget {
  const LessonLinesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    // Mock lesson lines data
    final lessonLines = [
      {'en': 'I have some progress updates.', 'vi': 'Tôi có một số cập nhật về tiến độ.'},
      {'en': "What's on your plate for today?", 'vi': 'Hôm nay bạn phải làm những gì?'},
      {'en': 'Can you share the link?', 'vi': 'Bạn có thể chia sẻ đường liên kết không?'},
      {'en': 'I have some life updates.', 'vi': 'Tôi có một số cập nhật về cuộc sống.'},
      {'en': 'I have some updates.', 'vi': 'Tôi có một số cập nhật.'},
      {'en': "What's on your plate for this week?", 'vi': 'Tuần này bạn phải làm những gì?'},
      {'en': "What's on the agenda for this meeting?", 'vi': 'Chương trình họp cho cuộc họp này là gì?'},
      {'en': "What's on your plate?", 'vi': 'Bạn phải làm những gì?'},
      {'en': "What's on the agenda?", 'vi': 'Chương trình là gì?'},
    ];

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.close, color: Colors.black54),
          onPressed: () => Navigator.pop(context),
        ),
        title: const SizedBox.shrink(),
      ),
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Title
          const Padding(
            padding: EdgeInsets.fromLTRB(20, 0, 20, 20),
            child: Text(
              'Lesson Lines',
              style: TextStyle(
                fontSize: 28,
                fontWeight: FontWeight.bold,
                color: AppColors.textPrimary,
              ),
            ),
          ),
          
          // Divider
          Container(
            height: 1,
            color: Colors.grey.shade200,
          ),
          
          // List of lines
          Expanded(
            child: ListView.separated(
              padding: const EdgeInsets.symmetric(vertical: 8),
              itemCount: lessonLines.length,
              separatorBuilder: (context, index) => Container(
                height: 1,
                margin: const EdgeInsets.symmetric(horizontal: 20),
                color: Colors.grey.shade100,
              ),
              itemBuilder: (context, index) {
                final line = lessonLines[index];
                return _buildLineItem(context, line['en']!, line['vi']!);
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildLineItem(BuildContext context, String english, String vietnamese) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Text content
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // English text with volume icon
                Row(
                  children: [
                    Expanded(
                      child: Text(
                        english,
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                          color: AppColors.textPrimary,
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    GestureDetector(
                      onTap: () {
                        // Play audio
                      },
                      child: Icon(
                        Icons.volume_up_outlined,
                        size: 20,
                        color: Colors.grey.shade400,
                      ),
                    ),
                  ],
                ),
                
                const SizedBox(height: 4),
                
                // Vietnamese translation
                Text(
                  vietnamese,
                  style: TextStyle(
                    fontSize: 14,
                    color: Colors.grey.shade500,
                  ),
                ),
              ],
            ),
          ),
          
          const SizedBox(width: 16),
          
          // Bookmark icon
          Icon(
            Icons.bookmark_outline,
            size: 24,
            color: AppColors.primary,
          ),
        ],
      ),
    );
  }
}
