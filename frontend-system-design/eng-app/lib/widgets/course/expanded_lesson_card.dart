import 'dart:math' as math;
import 'package:flutter/material.dart';
import '../../config/theme.dart';
import '../../screens/lesson/lesson_lines_screen.dart';
import '../../screens/lesson/report_problem_screen.dart';

enum LessonType { video, speaking, vocabulary }

class ExpandedLessonCard extends StatefulWidget {
  final String title;
  final String? avatarUrl;
  final String questionText;
  final LessonType selectedType;
  final double progress;
  final VoidCallback? onStart;
  final Function(LessonType)? onTypeSelected;
  final VoidCallback? onMoreOptions;

  const ExpandedLessonCard({
    super.key,
    required this.title,
    this.avatarUrl,
    required this.questionText,
    this.selectedType = LessonType.video,
    this.progress = 0.25,
    this.onStart,
    this.onTypeSelected,
    this.onMoreOptions,
  });

  @override
  State<ExpandedLessonCard> createState() => ExpandedLessonCardState();
}

class ExpandedLessonCardState extends State<ExpandedLessonCard> with TickerProviderStateMixin {
  bool _isExpanded = true;
  late AnimationController _expandController;
  late AnimationController _pulseController;
  late Animation<double> _expandAnimation;
  late Animation<double> _scaleAnimation;
  late Animation<double> _fadeAnimation;
  late Animation<double> _pulseAnimation;

  @override
  void initState() {
    super.initState();
    
    _expandController = AnimationController(
      duration: const Duration(milliseconds: 400),
      vsync: this,
    );
    
    _pulseController = AnimationController(
      duration: const Duration(milliseconds: 1800),
      vsync: this,
    );
    
    _expandAnimation = CurvedAnimation(
      parent: _expandController,
      curve: Curves.easeOutCubic,
    );
    
    // Scale from 1.0 to 0.0 (shrink to arrow point)
    _scaleAnimation = Tween<double>(begin: 1.0, end: 0.0).animate(
      CurvedAnimation(parent: _expandController, curve: Curves.easeInBack),
    );
    
    _fadeAnimation = Tween<double>(begin: 1.0, end: 0.0).animate(
      CurvedAnimation(parent: _expandController, curve: const Interval(0.3, 1.0, curve: Curves.easeOut)),
    );
    
    _pulseAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _pulseController, curve: Curves.easeOut),
    );
  }

  @override
  void dispose() {
    _expandController.dispose();
    _pulseController.dispose();
    super.dispose();
  }

  void _toggleExpand() {
    setState(() {
      _isExpanded = !_isExpanded;
      if (_isExpanded) {
        _expandController.reverse();
        _pulseController.stop();
        _pulseController.reset();
      } else {
        _expandController.forward();
        _pulseController.repeat();
      }
    });
  }

  // Public method to collapse from outside
  void collapse() {
    if (_isExpanded) {
      setState(() {
        _isExpanded = false;
        _expandController.forward();
        _pulseController.repeat();
      });
    }
  }

  void _showMoreOptions(BuildContext context) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (context) => Container(
        decoration: const BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Drag indicator
            Center(
              child: Container(
                margin: const EdgeInsets.only(top: 12),
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: Colors.grey.shade300,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
            ),
            
            // Title
            const Padding(
              padding: EdgeInsets.fromLTRB(24, 24, 24, 16),
              child: Text(
                'Video Lesson',
                style: TextStyle(
                  fontSize: 22,
                  fontWeight: FontWeight.bold,
                  color: AppColors.textPrimary,
                ),
              ),
            ),
            
            // View all lines
            ListTile(
              leading: Icon(
                Icons.format_list_bulleted,
                color: Colors.grey.shade700,
              ),
              title: const Text(
                'View all lines',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w500,
                ),
              ),
              onTap: () {
                Navigator.pop(context);
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => const LessonLinesScreen()),
                );
              },
            ),
            
            // Report a Problem
            ListTile(
              leading: Icon(
                Icons.error_outline,
                color: Colors.grey.shade700,
              ),
              title: const Text(
                'Report a Problem',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w500,
                ),
              ),
              onTap: () {
                Navigator.pop(context);
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => const ReportProblemScreen()),
                );
              },
            ),
            
            const SizedBox(height: 32),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // Bubble with avatar and ripple
        GestureDetector(
          onTap: _toggleExpand,
          child: Container(
            margin: const EdgeInsets.symmetric(horizontal: 16),
            child: Stack(
              clipBehavior: Clip.none,
              children: [
                // Main bubble with ripple inside (clipped)
                AnimatedBuilder(
                  animation: _pulseController,
                  builder: (context, child) {
                    return ClipRRect(
                      borderRadius: BorderRadius.circular(32),
                      child: Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: const Color(0xFF3B82F6),
                          borderRadius: BorderRadius.circular(32),
                        ),
                        child: Stack(
                          clipBehavior: Clip.none,
                          children: [
                            // Content row
                            Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                _buildAvatar(),
                                const SizedBox(width: 12),
                                Flexible(
                                  child: Text(
                                    widget.title,
                                    style: const TextStyle(
                                      fontSize: 17,
                                      fontWeight: FontWeight.w600,
                                      color: Colors.white,
                                      height: 1.3,
                                    ),
                                  ),
                                ),
                                const SizedBox(width: 8),
                              ],
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                ),
              ],
            ),
          ),
        ),
        
        // Expandable card - properly removes space when collapsed
        AnimatedSize(
          duration: const Duration(milliseconds: 350),
          curve: Curves.easeOutCubic,
          child: _isExpanded
              ? Column(
                  children: [
                    // Arrow centered
                    Center(
                      child: CustomPaint(
                        size: const Size(20, 10),
                        painter: _ArrowPainter(color: const Color(0xFF3B82F6)),
                      ),
                    ),
                    
                    // Card
                    Container(
                      margin: const EdgeInsets.symmetric(horizontal: 8),
                      padding: const EdgeInsets.fromLTRB(24, 20, 24, 16),
                      decoration: BoxDecoration(
                        gradient: const LinearGradient(
                          begin: Alignment.topCenter,
                          end: Alignment.bottomCenter,
                          colors: [Color(0xFF3B82F6), Color(0xFF2563EB)],
                        ),
                        borderRadius: BorderRadius.circular(28),
                        boxShadow: [
                          BoxShadow(
                            color: AppColors.primary.withOpacity(0.3),
                            blurRadius: 20,
                            offset: const Offset(0, 10),
                          ),
                        ],
                      ),
                      child: Column(
                        children: [
                          Row(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Expanded(
                                child: Text(
                                  widget.questionText,
                                  style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w600, color: Colors.white, height: 1.2),
                                ),
                              ),
                              GestureDetector(
                                onTap: () => _showMoreOptions(context),
                                child: Icon(Icons.more_horiz, color: Colors.white.withOpacity(0.5), size: 24),
                              ),
                            ],
                          ),
                          const SizedBox(height: 24),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              _buildTypeButton(LessonType.video, Icons.play_arrow_rounded, 'Video Lesson'),
                              const SizedBox(width: 24),
                              _buildTypeButton(LessonType.speaking, Icons.mic, 'Speaking'),
                              const SizedBox(width: 24),
                              _buildTypeButton(LessonType.vocabulary, Icons.translate, 'Vocabulary'),
                            ],
                          ),
                          const SizedBox(height: 24),
                          SizedBox(
                            width: double.infinity,
                            height: 52,
                            child: ElevatedButton(
                              onPressed: widget.onStart,
                              style: ElevatedButton.styleFrom(
                                backgroundColor: Colors.white,
                                foregroundColor: AppColors.primary,
                                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(26)),
                                elevation: 0,
                              ),
                              child: const Text('Start', style: TextStyle(fontSize: 17, fontWeight: FontWeight.w600)),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                )
              : const SizedBox.shrink(),
        ),
      ],
    );
  }

  Widget _buildAvatar() {
    return AnimatedBuilder(
      animation: _pulseController,
      builder: (context, child) {
        final phase = _pulseAnimation.value;
        
        // Phase 1 (0-0.5): Both bounce and border scale up together
        // Phase 2 (0.5-1.0): Ring shoots out, avatar stays max size then shrinks back
        
        double bounce;
        double borderWidth;
        double ringSize;
        double ringWidth;
        double ringOpacity;
        double ringBlur;
        
        if (phase < 0.5) {
          // Phase 1: Avatar and border grow together
          final growPhase = phase * 2; // 0 to 1 during first half
          bounce = _isExpanded ? 1.0 : (1.0 + (growPhase * 0.08)); // 1.0 to 1.08
          borderWidth = 2.0 + (growPhase * 3.0); // 2 to 5
          ringSize = 60.0;
          ringWidth = 2.0;
          ringOpacity = 0.0;
          ringBlur = 0.0;
        } else {
          // Phase 2: Ring shoots out, avatar shrinks back to normal
          final ringPhase = (phase - 0.5) * 2; // 0 to 1 during second half
          bounce = _isExpanded ? 1.0 : (1.08 - (ringPhase * 0.08)); // 1.08 back to 1.0
          borderWidth = 5.0 - (ringPhase * 3.0); // 5 back to 2
          ringSize = 60.0 + (ringPhase * 400.0); // 60 to 460
          ringWidth = 2.0 + (ringPhase * 30.0); // 2 to 32
          ringOpacity = 1.0 - ringPhase; // Fades out
          ringBlur = ringPhase * 20.0;
        }
        
        return Transform.scale(
          scale: bounce,
          child: SizedBox(
            width: 60,
            height: 60,
            child: Stack(
              alignment: Alignment.center,
              clipBehavior: Clip.none, // Allow ring to overflow
              children: [
                // Shooting ring effect (phase 2 only) - positioned absolutely to overflow
                if (!_isExpanded && ringOpacity > 0.1)
                  Positioned(
                    left: (60 - ringSize) / 2,
                    top: (60 - ringSize) / 2,
                    child: Container(
                      width: ringSize,
                      height: ringSize,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        border: Border.all(
                          color: const Color(0xFF60D5FF).withOpacity(ringOpacity * 0.3),
                          width: ringWidth,
                        ),
                        // Multiple layers for very soft blur effect
                        boxShadow: [
                          // Very soft outer blur (wide)
                          BoxShadow(
                            color: const Color(0xFF60D5FF).withOpacity(ringOpacity * 0.15),
                            blurRadius: 50 + ringBlur,
                            spreadRadius: ringWidth,
                          ),
                          // Medium blur
                          BoxShadow(
                            color: const Color(0xFF87CEEB).withOpacity(ringOpacity * 0.25),
                            blurRadius: 30 + ringBlur,
                            spreadRadius: ringWidth / 2,
                          ),
                          // Inner glow
                          BoxShadow(
                            color: const Color(0xFF60D5FF).withOpacity(ringOpacity * 0.35),
                            blurRadius: 10 + ringBlur,
                            spreadRadius: 0,
                          ),
                        ],
                      ),
                    ),
                  ),
                
                // Main avatar
                Container(
                  width: 60,
                  height: 60,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    // Soft cyan glow like reference
                    boxShadow: !_isExpanded ? [
                      // Outer soft glow
                      BoxShadow(
                        color: const Color(0xFF87CEEB).withOpacity(0.5),
                        blurRadius: 20,
                        spreadRadius: 5,
                      ),
                      // Inner brighter glow
                      BoxShadow(
                        color: const Color(0xFF60D5FF).withOpacity(0.3),
                        blurRadius: 8,
                        spreadRadius: 2,
                      ),
                    ] : null,
                  ),
                  child: Container(
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      border: Border.all(
                        color: const Color(0xFF60D5FF),
                        width: _isExpanded ? 3.0 : borderWidth,
                      ),
                    ),
                    child: ClipOval(
                      child: Stack(
                        children: [
                          widget.avatarUrl != null
                              ? Image.network(
                                  widget.avatarUrl!,
                                  fit: BoxFit.cover,
                                  width: 60,
                                  height: 60,
                                  errorBuilder: (_, __, ___) => _buildPlaceholderAvatar(),
                                )
                              : _buildPlaceholderAvatar(),
                          
                          // Progress ring when expanded
                          if (_isExpanded)
                            CustomPaint(
                              size: const Size(52, 52),
                              painter: _ProgressRingPainter(
                                progress: widget.progress,
                                activeColor: Colors.white,
                                inactiveColor: const Color(0xFF60A5FA),
                                strokeWidth: 3,
                              ),
                            ),
                        ],
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildPlaceholderAvatar() {
    return Container(
      width: 52,
      height: 52,
      color: Colors.grey[300],
      child: const Icon(Icons.person, color: Colors.grey, size: 28),
    );
  }

  Widget _buildTypeButton(LessonType type, IconData icon, String label) {
    final isSelected = widget.selectedType == type;
    return GestureDetector(
      onTap: () => widget.onTypeSelected?.call(type),
      child: Column(
        children: [
          AnimatedContainer(
            duration: const Duration(milliseconds: 200),
            width: 60,
            height: 60,
            decoration: BoxDecoration(
              color: isSelected ? Colors.white : Colors.white.withOpacity(0.15),
              shape: BoxShape.circle,
            ),
            child: Icon(icon, size: 32, color: isSelected ? AppColors.primary : Colors.white),
          ),
          const SizedBox(height: 8),
          // Keep fixed height, animate only opacity
          SizedBox(
            height: 16,
            child: AnimatedOpacity(
              duration: const Duration(milliseconds: 150),
              opacity: isSelected ? 1.0 : 0.0,
              child: Text(
                label,
                style: const TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w500,
                  color: Colors.white,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _ProgressRingPainter extends CustomPainter {
  final double progress;
  final Color activeColor;
  final Color inactiveColor;
  final double strokeWidth;

  _ProgressRingPainter({
    required this.progress,
    required this.activeColor,
    required this.inactiveColor,
    required this.strokeWidth,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = (size.width / 2) - strokeWidth / 2;
    const gapAngle = 0.2;
    const segments = 4;
    final segmentAngle = (2 * math.pi - (segments * gapAngle)) / segments;
    final activeSegments = (progress * segments).ceil();
    
    for (int i = 0; i < segments; i++) {
      final startAngle = -math.pi / 2 + i * (segmentAngle + gapAngle);
      final paint = Paint()
        ..color = i < activeSegments ? activeColor : inactiveColor
        ..strokeWidth = strokeWidth
        ..style = PaintingStyle.stroke
        ..strokeCap = StrokeCap.round;
      
      canvas.drawArc(
        Rect.fromCircle(center: center, radius: radius),
        startAngle,
        segmentAngle,
        false,
        paint,
      );
    }
  }

  @override
  bool shouldRepaint(covariant _ProgressRingPainter oldDelegate) => oldDelegate.progress != progress;
}

class _ArrowPainter extends CustomPainter {
  final Color color;
  _ArrowPainter({required this.color});
  
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()..color = color..style = PaintingStyle.fill;
    final path = Path()
      ..moveTo(0, size.height)
      ..lineTo(size.width / 2, 0)
      ..lineTo(size.width, size.height)
      ..close();
    canvas.drawPath(path, paint);
  }
  
  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
