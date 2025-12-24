import 'package:flutter/material.dart';
import '../../config/theme.dart';
import '../../models/unit.dart';

class LessonBubble extends StatelessWidget {
  final Lesson lesson;
  final VoidCallback? onTap;

  const LessonBubble({
    super.key,
    required this.lesson,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: lesson.status != LessonStatus.locked ? onTap : null,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
        decoration: BoxDecoration(
          gradient: lesson.status == LessonStatus.inProgress
              ? const LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [
                    Color(0xFF3B82F6),
                    Color(0xFF2563EB),
                  ],
                )
              : null,
          color: lesson.status == LessonStatus.locked
              ? AppColors.surfaceSecondary
              : lesson.status == LessonStatus.completed
                  ? const Color(0xFF10B981)
                  : null,
          borderRadius: BorderRadius.circular(20),
          boxShadow: lesson.status == LessonStatus.inProgress
              ? [
                  BoxShadow(
                    color: AppColors.primary.withOpacity(0.3),
                    blurRadius: 12,
                    offset: const Offset(0, 4),
                  ),
                ]
              : null,
        ),
        child: Row(
          children: [
            // Loading/Status indicator
            _buildStatusIndicator(),
            const SizedBox(width: 12),
            
            // Lesson info
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    lesson.title,
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                      color: _getTextColor(),
                    ),
                  ),
                  if (lesson.description != null) ...[
                    const SizedBox(height: 2),
                    Text(
                      lesson.description!,
                      style: TextStyle(
                        fontSize: 13,
                        color: _getSecondaryTextColor(),
                      ),
                    ),
                  ],
                ],
              ),
            ),
            
            // Arrow or lock
            if (lesson.status == LessonStatus.locked)
              Icon(
                Icons.lock_outline,
                color: AppColors.textMuted,
                size: 20,
              )
            else if (lesson.status != LessonStatus.inProgress)
              Icon(
                Icons.chevron_right,
                color: _getTextColor(),
                size: 24,
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatusIndicator() {
    if (lesson.status == LessonStatus.inProgress) {
      return SizedBox(
        width: 32,
        height: 32,
        child: Stack(
          alignment: Alignment.center,
          children: [
            CircularProgressIndicator(
              value: null, // Indeterminate
              strokeWidth: 2,
              valueColor: const AlwaysStoppedAnimation<Color>(Colors.white),
            ),
          ],
        ),
      );
    }

    if (lesson.status == LessonStatus.completed) {
      return Container(
        width: 32,
        height: 32,
        decoration: const BoxDecoration(
          color: Colors.white,
          shape: BoxShape.circle,
        ),
        child: const Icon(
          Icons.check,
          color: Color(0xFF10B981),
          size: 20,
        ),
      );
    }

    return Container(
      width: 32,
      height: 32,
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.2),
        shape: BoxShape.circle,
        border: Border.all(
          color: AppColors.border,
          width: 2,
        ),
      ),
    );
  }

  Color _getTextColor() {
    switch (lesson.status) {
      case LessonStatus.inProgress:
      case LessonStatus.completed:
        return Colors.white;
      case LessonStatus.available:
        return AppColors.textPrimary;
      case LessonStatus.locked:
        return AppColors.textMuted;
    }
  }

  Color _getSecondaryTextColor() {
    switch (lesson.status) {
      case LessonStatus.inProgress:
      case LessonStatus.completed:
        return Colors.white.withOpacity(0.8);
      case LessonStatus.available:
        return AppColors.textSecondary;
      case LessonStatus.locked:
        return AppColors.textMuted;
    }
  }
}
