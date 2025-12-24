import 'dart:async';
import 'package:flutter/material.dart';
import '../../config/theme.dart';
import 'speaking_exercise_screen.dart';

class VideoLessonScreen extends StatefulWidget {
  final String? videoUrl;
  final String lessonTitle;
  
  const VideoLessonScreen({
    super.key,
    this.videoUrl,
    this.lessonTitle = 'Business English',
  });

  @override
  State<VideoLessonScreen> createState() => _VideoLessonScreenState();
}

class _VideoLessonScreenState extends State<VideoLessonScreen> {
  bool _isPlaying = true;
  bool _canSpeakNow = false;
  bool _showControls = false;
  double _progress = 0.03;
  final double _duration = 4.25;
  String _currentSubtitle = 'Xin chào. Tên tôi là Audrey';
  Timer? _hideControlsTimer;
  Timer? _progressTimer;
  
  // Speaking exercises trigger points (in minutes)
  final List<double> _speakingTriggers = [0.5, 1.5, 2.5, 3.5];
  int _currentExerciseIndex = 0;
  bool _exerciseShown = false;
  
  // 0 = off, 1 = Vietnamese (ệ), 2 = English (A)
  int _languageMode = 0;
  
  @override
  void initState() {
    super.initState();
    _startVideoProgress();
  }
  
  void _startVideoProgress() {
    _progressTimer = Timer.periodic(const Duration(milliseconds: 100), (timer) {
      if (_isPlaying && mounted) {
        setState(() {
          _progress += 0.00167; // Advance ~0.1 seconds
          if (_progress >= _duration) {
            _progress = _duration;
            _isPlaying = false;
            timer.cancel();
          }
        });
        
        // Check if we hit a speaking trigger
        _checkSpeakingTrigger();
      }
    });
  }
  
  void _checkSpeakingTrigger() {
    if (_exerciseShown || _currentExerciseIndex >= _speakingTriggers.length) return;
    
    if (_progress >= _speakingTriggers[_currentExerciseIndex]) {
      _exerciseShown = true;
      _isPlaying = false;
      _showSpeakingExercise();
    }
  }
  
  void _showSpeakingExercise() {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => SpeakingExerciseScreen(
          sentenceTemplate: 'Can you share ___?',
          fullSentence: 'Can you share your screen?',
          translation: 'Bạn chia sẻ màn hình được không?',
          currentStep: _currentExerciseIndex + 1,
          totalSteps: _speakingTriggers.length,
          onComplete: () {
            Navigator.pop(context);
            setState(() {
              _currentExerciseIndex++;
              _exerciseShown = false;
              _isPlaying = true;
            });
          },
          onClose: () {
            Navigator.pop(context);
            setState(() {
              _currentExerciseIndex++;
              _exerciseShown = false;
              _isPlaying = true;
            });
          },
        ),
      ),
    );
  }
  
  @override
  void dispose() {
    _progressTimer?.cancel();
    _hideControlsTimer?.cancel();
    super.dispose();
  }
  
  void _toggleControls() {
    setState(() {
      _showControls = !_showControls;
    });
    
    if (_showControls) {
      _startHideTimer();
    } else {
      _hideControlsTimer?.cancel();
    }
  }
  
  void _startHideTimer() {
    _hideControlsTimer?.cancel();
    _hideControlsTimer = Timer(const Duration(seconds: 5), () {
      if (mounted) {
        setState(() {
          _showControls = false;
        });
      }
    });
  }
  
  void _resetHideTimer() {
    if (_showControls) {
      _startHideTimer();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        top: false,
        child: GestureDetector(
          onTap: _toggleControls,
          child: Stack(
            children: [
              // Full screen video area
              Positioned.fill(
                child: Container(
                  color: Colors.white,
                  child: Column(
                    children: [
                      // Video content fills most of the screen
                      Expanded(
                        child: Container(
                          width: double.infinity,
                          decoration: const BoxDecoration(
                            gradient: LinearGradient(
                              begin: Alignment.topCenter,
                              end: Alignment.bottomCenter,
                              colors: [
                                Colors.white,
                                Color(0xFFF8F9FA),
                              ],
                            ),
                          ),
                          child: Center(
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                // Avatar placeholder for video
                                Container(
                                  width: 200,
                                  height: 200,
                                  decoration: BoxDecoration(
                                    color: const Color(0xFF3B82F6),
                                    shape: BoxShape.circle,
                                  ),
                                  child: const Icon(
                                    Icons.person,
                                    size: 120,
                                    color: Colors.white,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                      
                      // Subtitle at bottom (always visible)
                      Container(
                        width: double.infinity,
                        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
                        color: const Color(0xFFF3F4F6),
                        child: Text(
                          _currentSubtitle,
                          textAlign: TextAlign.center,
                          style: const TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.w500,
                            color: AppColors.textPrimary,
                            height: 1.4,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              
              // Controls overlay (only shows on tap)
              AnimatedOpacity(
                opacity: _showControls ? 1.0 : 0.0,
                duration: const Duration(milliseconds: 200),
                child: IgnorePointer(
                  ignoring: !_showControls,
                  child: Container(
                    color: Colors.black.withOpacity(0.4),
                    child: Column(
                      children: [
                        // Top bar
                        SafeArea(
                          bottom: false,
                          child: _buildTopBar(),
                        ),
                        
                        // Title
                        _buildTitle(),
                        
                        // Spacer for video area
                        const Expanded(child: SizedBox()),
                        
                        // Bottom controls
                        Container(
                          padding: const EdgeInsets.only(bottom: 60),
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              begin: Alignment.topCenter,
                              end: Alignment.bottomCenter,
                              colors: [
                                Colors.transparent,
                                Colors.black.withOpacity(0.6),
                              ],
                            ),
                          ),
                          child: Column(
                            children: [
                              _buildProgressBar(),
                              const SizedBox(height: 8),
                              _buildSubtitleText(),
                              const SizedBox(height: 16),
                              _buildControls(),
                            ],
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
      ),
    );
  }

  Widget _buildTopBar() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      child: Row(
        children: [
          // Close button
          GestureDetector(
            onTap: () => _showQuitDialog(),
            child: Container(
              width: 36,
              height: 36,
              decoration: BoxDecoration(
                color: Colors.black.withOpacity(0.3),
                shape: BoxShape.circle,
              ),
              child: const Icon(
                Icons.close,
                size: 24,
                color: Colors.white,
              ),
            ),
          ),
          
          const Spacer(),
          
          // Can't speak now toggle
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            decoration: BoxDecoration(
              color: Colors.black.withOpacity(0.3),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Row(
              children: [
                const Text(
                  "Can't speak now",
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w500,
                    color: Colors.white,
                  ),
                ),
                const SizedBox(width: 8),
                GestureDetector(
                  onTap: () {
                    setState(() {
                      _canSpeakNow = !_canSpeakNow;
                    });
                  },
                  child: AnimatedContainer(
                    duration: const Duration(milliseconds: 200),
                    width: 48,
                    height: 28,
                    decoration: BoxDecoration(
                      color: _canSpeakNow ? AppColors.primary : Colors.grey.shade400,
                      borderRadius: BorderRadius.circular(14),
                    ),
                    child: Stack(
                      children: [
                        AnimatedPositioned(
                          duration: const Duration(milliseconds: 200),
                          left: _canSpeakNow ? 22 : 4,
                          top: 4,
                          child: Container(
                            width: 20,
                            height: 20,
                            decoration: const BoxDecoration(
                              color: Colors.white,
                              shape: BoxShape.circle,
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
        ],
      ),
    );
  }

  Widget _buildTitle() {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 16),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Text(
            '✨ ',
            style: TextStyle(fontSize: 24),
          ),
          Text(
            widget.lessonTitle,
            style: const TextStyle(
              fontSize: 26,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
          const Text(
            ' ✨',
            style: TextStyle(fontSize: 24),
          ),
        ],
      ),
    );
  }

  Widget _buildProgressBar() {
    final int currentSeconds = (_progress * 60).toInt();
    final String currentTime = '${(currentSeconds ~/ 60).toString().padLeft(2, '0')}:${(currentSeconds % 60).toString().padLeft(2, '0')}';
    final String totalTime = '-0${(_duration).toInt()}:${(((_duration - _duration.toInt()) * 60).toInt()).toString().padLeft(2, '0')}';
    
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: Column(
        children: [
          Row(
            children: [
              Text(
                currentTime,
                style: const TextStyle(
                  fontSize: 12,
                  color: Colors.white70,
                ),
              ),
              const Spacer(),
              Text(
                totalTime,
                style: const TextStyle(
                  fontSize: 12,
                  color: Colors.white70,
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          SliderTheme(
            data: SliderThemeData(
              trackHeight: 4,
              thumbShape: const RoundSliderThumbShape(enabledThumbRadius: 6),
              overlayShape: const RoundSliderOverlayShape(overlayRadius: 12),
              activeTrackColor: Colors.white,
              inactiveTrackColor: Colors.white.withOpacity(0.3),
              thumbColor: Colors.white,
              overlayColor: Colors.white.withOpacity(0.2),
            ),
            child: Slider(
              value: _progress / _duration,
              onChanged: (value) {
                _resetHideTimer();
                setState(() {
                  _progress = value * _duration;
                });
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSubtitleText() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24),
      child: Text(
        _currentSubtitle,
        textAlign: TextAlign.center,
        style: const TextStyle(
          fontSize: 16,
          color: Colors.white,
          height: 1.4,
        ),
      ),
    );
  }

  Widget _buildControls() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 32),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: [
          // Language toggle (cycles: off -> ệ -> A -> off)
          GestureDetector(
            onTap: () {
              _resetHideTimer();
              setState(() {
                _languageMode = (_languageMode + 1) % 3;
              });
            },
            child: Container(
              width: 48,
              height: 48,
              alignment: Alignment.center,
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    'ệ',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w600,
                      color: _languageMode == 1 
                          ? Colors.white 
                          : Colors.white.withOpacity(0.5),
                    ),
                  ),
                  Text(
                    '/',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w600,
                      color: Colors.white.withOpacity(0.5),
                    ),
                  ),
                  Text(
                    'A',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w600,
                      color: _languageMode == 2 
                          ? Colors.white 
                          : Colors.white.withOpacity(0.5),
                    ),
                  ),
                ],
              ),
            ),
          ),
          
          // Rewind 5s
          _buildControlButton(
            icon: Icons.replay_5,
            size: 32,
            onTap: () {
              _resetHideTimer();
              setState(() {
                _progress = (_progress - 0.083).clamp(0, _duration);
              });
            },
          ),
          
          // Play/Pause
          GestureDetector(
            onTap: () {
              _resetHideTimer();
              setState(() {
                _isPlaying = !_isPlaying;
              });
            },
            child: Container(
              width: 72,
              height: 72,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                border: Border.all(color: Colors.white, width: 3),
              ),
              child: Icon(
                _isPlaying ? Icons.pause : Icons.play_arrow,
                size: 44,
                color: Colors.white,
              ),
            ),
          ),
          
          // Forward 5s
          _buildControlButton(
            icon: Icons.forward_5,
            size: 32,
            onTap: () {
              _resetHideTimer();
              setState(() {
                _progress = (_progress + 0.083).clamp(0, _duration);
              });
            },
          ),
          
          // Speed
          _buildControlButton(
            label: '1x',
            size: 22,
            onTap: () {
              _resetHideTimer();
            },
          ),
        ],
      ),
    );
  }

  Widget _buildControlButton({
    IconData? icon,
    String? label,
    double size = 24,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 48,
        height: 48,
        alignment: Alignment.center,
        child: icon != null
            ? Icon(icon, size: size, color: Colors.white)
            : Text(
                label ?? '',
                style: TextStyle(
                  fontSize: size,
                  fontWeight: FontWeight.w600,
                  color: Colors.white,
                ),
              ),
      ),
    );
  }

  void _showQuitDialog() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => Container(
        decoration: const BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
        ),
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Close button
            Align(
              alignment: Alignment.topLeft,
              child: GestureDetector(
                onTap: () => Navigator.pop(context),
                child: Container(
                  width: 36,
                  height: 36,
                  decoration: BoxDecoration(
                    color: Colors.grey.shade200,
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(Icons.close, size: 20, color: Colors.grey),
                ),
              ),
            ),
            
            const SizedBox(height: 16),
            
            // Mascot
            Container(
              width: 80,
              height: 80,
              decoration: BoxDecoration(
                color: AppColors.primary,
                borderRadius: BorderRadius.circular(20),
              ),
              child: const Icon(
                Icons.sentiment_dissatisfied,
                size: 50,
                color: Colors.white,
              ),
            ),
            
            const SizedBox(height: 24),
            
            // Message
            const Text(
              'Wait, you only have a few\nminutes left in this lesson!',
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 22,
                fontWeight: FontWeight.bold,
                color: AppColors.textPrimary,
                height: 1.3,
              ),
            ),
            
            const SizedBox(height: 32),
            
            // Keep Learning button
            SizedBox(
              width: double.infinity,
              height: 52,
              child: ElevatedButton(
                onPressed: () => Navigator.pop(context),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primary,
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(26),
                  ),
                  elevation: 0,
                ),
                child: const Text(
                  'Keep Learning',
                  style: TextStyle(
                    fontSize: 17,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ),
            
            const SizedBox(height: 16),
            
            // Quit button
            TextButton(
              onPressed: () {
                Navigator.pop(context);
                Navigator.pop(context);
              },
              child: Text(
                'Quit',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                  color: AppColors.primary,
                ),
              ),
            ),
            
            const SizedBox(height: 16),
          ],
        ),
      ),
    );
  }
}
