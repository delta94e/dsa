import 'package:flutter/material.dart';
import '../../config/theme.dart';

enum SpeakingState { waiting, listening, completed, tryAgain }

class SpeakingExerciseScreen extends StatefulWidget {
  final String sentenceTemplate; // e.g., "Can you share ___?"
  final String fullSentence; // e.g., "Can you share your screen?"
  final String translation;
  final int currentStep;
  final int totalSteps;
  final bool autoMode;
  final VoidCallback? onComplete;
  final VoidCallback? onClose;

  const SpeakingExerciseScreen({
    super.key,
    required this.sentenceTemplate,
    required this.fullSentence,
    required this.translation,
    this.currentStep = 1,
    this.totalSteps = 4,
    this.autoMode = true,
    this.onComplete,
    this.onClose,
  });

  @override
  State<SpeakingExerciseScreen> createState() => _SpeakingExerciseScreenState();
}

class _SpeakingExerciseScreenState extends State<SpeakingExerciseScreen> {
  SpeakingState _state = SpeakingState.waiting;
  List<String> _words = [];
  List<bool> _spokenWords = []; // Which words have been "spoken"
  int _currentWordIndex = 0;

  @override
  void initState() {
    super.initState();
    _words = widget.fullSentence.split(' ');
    _spokenWords = List.filled(_words.length, false);
  }

  void _startListening() {
    setState(() {
      _state = SpeakingState.listening;
    });
    
    // Simulate speech recognition - mark words as spoken one by one
    _simulateSpeaking();
  }

  void _simulateSpeaking() async {
    for (int i = 0; i < _words.length; i++) {
      await Future.delayed(const Duration(milliseconds: 400));
      if (!mounted) return;
      setState(() {
        _spokenWords[i] = true;
        _currentWordIndex = i + 1;
      });
    }
    
    await Future.delayed(const Duration(milliseconds: 300));
    if (!mounted) return;
    setState(() {
      _state = SpeakingState.completed;
    });
  }

  void _restart() {
    setState(() {
      _state = SpeakingState.waiting;
      _spokenWords = List.filled(_words.length, false);
      _currentWordIndex = 0;
    });
  }

  void _tryAgain() {
    setState(() {
      _state = SpeakingState.tryAgain;
      _spokenWords = List.filled(_words.length, false);
      _currentWordIndex = 0;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF5F7FA),
      body: SafeArea(
        child: Column(
          children: [
            // Top bar
            _buildTopBar(),
            
            // Progress segments
            _buildProgressBar(),
            
            const Spacer(),
            
            // Main card (taps absorbed here)
            GestureDetector(
              onTap: () {
                // Card tap - start listening if waiting
                if (_state == SpeakingState.waiting) {
                  _startListening();
                }
                // Don't do anything else - let internal buttons handle their taps
              },
              child: _buildMainCard(),
            ),
            
            const Spacer(),
            
            // Tap to continue button (only this triggers completion)
            if (_state == SpeakingState.completed)
              GestureDetector(
                onTap: () {
                  widget.onComplete?.call();
                },
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
                  margin: const EdgeInsets.only(bottom: 40),
                  decoration: BoxDecoration(
                    color: AppColors.primary.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    'TAP TO CONTINUE →',
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                      color: AppColors.primary,
                      letterSpacing: 1,
                    ),
                  ),
                ),
              )
            else
              Padding(
                padding: const EdgeInsets.only(bottom: 60),
                child: Text(
                  _state == SpeakingState.waiting 
                      ? 'TAP CARD TO START SPEAKING'
                      : 'SPEAKING...',
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w500,
                    color: Colors.grey.shade400,
                    letterSpacing: 1,
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildTopBar() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      child: Row(
        children: [
          // Close button
          GestureDetector(
            onTap: widget.onClose ?? () => Navigator.pop(context),
            child: const Icon(
              Icons.close,
              size: 28,
              color: Colors.black54,
            ),
          ),
          
          const Spacer(),
          
          // Sentence template dropdown
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            child: Row(
              children: [
                Text(
                  widget.sentenceTemplate,
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w500,
                    color: AppColors.textPrimary,
                  ),
                ),
                const SizedBox(width: 4),
                const Icon(Icons.keyboard_arrow_down, size: 18),
              ],
            ),
          ),
          
          const Spacer(),
          
          // Auto toggle
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            decoration: BoxDecoration(
              color: widget.autoMode ? AppColors.primary : Colors.grey.shade300,
              borderRadius: BorderRadius.circular(4),
            ),
            child: const Text(
              'AUTO\nON',
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 10,
                fontWeight: FontWeight.w600,
                color: Colors.white,
                height: 1.2,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildProgressBar() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Row(
        children: List.generate(widget.totalSteps, (index) {
          final isCompleted = index < widget.currentStep;
          final isCurrent = index == widget.currentStep - 1;
          
          return Expanded(
            child: Container(
              height: 4,
              margin: EdgeInsets.only(right: index < widget.totalSteps - 1 ? 4 : 0),
              decoration: BoxDecoration(
                color: isCompleted || isCurrent 
                    ? AppColors.primary 
                    : Colors.grey.shade300,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
          );
        }),
      ),
    );
  }

  Widget _buildMainCard() {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 20,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Top actions
          Row(
            children: [
              // Flag
              Icon(Icons.flag_outlined, color: Colors.grey.shade400, size: 24),
              
              const Spacer(),
              
              // Status button
              _buildStatusButton(),
              
              const Spacer(),
              
              // Bookmark
              Icon(Icons.bookmark_outline, color: Colors.grey.shade400, size: 24),
            ],
          ),
          
          const SizedBox(height: 32),
          
          // Sentence with word highlighting
          _buildSentence(),
          
          const SizedBox(height: 24),
          
          // Audio buttons (only show after speaking)
          if (_state == SpeakingState.completed || _state == SpeakingState.tryAgain)
            _buildAudioButtons(),
          
          const SizedBox(height: 16),
          
          // Translation
          Text(
            widget.translation,
            textAlign: TextAlign.center,
            style: const TextStyle(
              fontSize: 16,
              color: AppColors.textPrimary,
              height: 1.4,
            ),
          ),
          
          const SizedBox(height: 24),
          
          // Restart button
          if (_state == SpeakingState.completed || _state == SpeakingState.tryAgain)
            _buildRestartButton(),
          
          // Controls when listening
          if (_state == SpeakingState.listening)
            _buildListeningControls(),
        ],
      ),
    );
  }

  Widget _buildStatusButton() {
    switch (_state) {
      case SpeakingState.waiting:
        return const SizedBox.shrink();
      case SpeakingState.listening:
        return Container(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
          decoration: BoxDecoration(
            color: AppColors.primary,
            borderRadius: BorderRadius.circular(24),
          ),
          child: const Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(Icons.mic, color: Colors.white, size: 18),
              SizedBox(width: 8),
              Text(
                'Speak now...',
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                  color: Colors.white,
                ),
              ),
            ],
          ),
        );
      case SpeakingState.tryAgain:
      case SpeakingState.completed:
        return Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          decoration: BoxDecoration(
            color: Colors.grey.shade200,
            borderRadius: BorderRadius.circular(20),
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(Icons.close, color: Colors.grey.shade600, size: 16),
              const SizedBox(width: 4),
              Text(
                'Try again',
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w500,
                  color: Colors.grey.shade600,
                ),
              ),
            ],
          ),
        );
    }
  }

  Widget _buildSentence() {
    return Wrap(
      alignment: WrapAlignment.center,
      spacing: 8,
      runSpacing: 8,
      children: List.generate(_words.length, (index) {
        final word = _words[index];
        final isSpoken = _spokenWords[index];
        
        return GestureDetector(
          onTap: () {
            // Show word meaning
            _showWordMeaning(word);
          },
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                word,
                style: TextStyle(
                  fontSize: 28,
                  fontWeight: FontWeight.w600,
                  color: isSpoken 
                      ? const Color(0xFF22C55E) // Green for spoken
                      : Colors.grey.shade400,
                  decoration: isSpoken ? TextDecoration.underline : null,
                  decorationColor: const Color(0xFF22C55E),
                ),
              ),
              if (isSpoken)
                Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(Icons.people, size: 12, color: Colors.grey.shade400),
                    const SizedBox(width: 2),
                    Text(
                      '${(index + 1) * 100}K',
                      style: TextStyle(
                        fontSize: 10,
                        color: Colors.grey.shade400,
                      ),
                    ),
                  ],
                ),
            ],
          ),
        );
      }),
    );
  }
  
  void _showWordMeaning(String word) {
    // Clean word
    final cleanWord = word.replaceAll(RegExp(r'[?.,!]'), '');
    
    // Mock data
    final practiceCount = (cleanWord.length * 10000 + 322).toString();
    
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      isScrollControlled: true,
      builder: (context) => Container(
        padding: const EdgeInsets.fromLTRB(24, 20, 24, 40),
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
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: Colors.grey.shade300,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
            ),
            
            const SizedBox(height: 20),
            
            // Users practiced count
            Row(
              children: [
                Icon(Icons.people, size: 16, color: Colors.grey.shade500),
                const SizedBox(width: 6),
                Text(
                  '$practiceCount users practiced this word',
                  style: TextStyle(
                    fontSize: 13,
                    color: Colors.grey.shade500,
                  ),
                ),
              ],
            ),
            
            const SizedBox(height: 12),
            
            // Word
            Text(
              cleanWord,
              style: const TextStyle(
                fontSize: 28,
                fontWeight: FontWeight.bold,
                color: AppColors.textPrimary,
              ),
            ),
            
            const SizedBox(height: 20),
            
            // Divider
            Container(
              height: 1,
              color: Colors.grey.shade200,
            ),
            
            const SizedBox(height: 20),
            
            // How it is pronounced
            Text(
              'HOW IT IS PRONOUNCED',
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w600,
                color: Colors.grey.shade400,
                letterSpacing: 0.5,
              ),
            ),
            
            const SizedBox(height: 12),
            
            // Pronunciation skeleton with shimmer
            _SkeletonLoader(width: 120, height: 40),
            
            const SizedBox(height: 32),
            
            // Bottom buttons
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                // Listen button
                GestureDetector(
                  onTap: () {
                    // Play pronunciation
                  },
                  child: Container(
                    width: 56,
                    height: 56,
                    decoration: BoxDecoration(
                      color: Colors.grey.shade100,
                      shape: BoxShape.circle,
                    ),
                    child: Icon(
                      Icons.volume_up,
                      color: Colors.grey.shade600,
                      size: 24,
                    ),
                  ),
                ),
                
                // Mic button (record)
                GestureDetector(
                  onTap: () {
                    // Record pronunciation
                  },
                  child: Container(
                    width: 56,
                    height: 56,
                    decoration: const BoxDecoration(
                      color: AppColors.primary,
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(
                      Icons.mic,
                      color: Colors.white,
                      size: 24,
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildAudioButtons() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        // Example button
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          decoration: BoxDecoration(
            border: Border.all(color: Colors.grey.shade300),
            borderRadius: BorderRadius.circular(20),
          ),
          child: Row(
            children: [
              Icon(Icons.volume_up, color: AppColors.primary, size: 18),
              const SizedBox(width: 6),
              Text(
                'Example',
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w500,
                  color: AppColors.primary,
                ),
              ),
            ],
          ),
        ),
        
        const SizedBox(width: 16),
        
        // You button
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          decoration: BoxDecoration(
            border: Border.all(color: Colors.grey.shade300),
            borderRadius: BorderRadius.circular(20),
          ),
          child: Row(
            children: [
              Icon(Icons.people, color: AppColors.primary, size: 18),
              const SizedBox(width: 6),
              Text(
                'You',
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w500,
                  color: AppColors.primary,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildRestartButton() {
    return GestureDetector(
      onTap: _restart,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
        decoration: BoxDecoration(
          border: Border.all(color: Colors.grey.shade300),
          borderRadius: BorderRadius.circular(28),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(Icons.refresh, color: AppColors.primary, size: 20),
            const SizedBox(width: 8),
            Text(
              'Restart',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w600,
                color: AppColors.primary,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildListeningControls() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        // Undo button
        Container(
          width: 48,
          height: 48,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            border: Border.all(color: Colors.grey.shade300),
          ),
          child: Icon(Icons.refresh, color: AppColors.primary, size: 24),
        ),
        
        const SizedBox(width: 16),
        
        // Pause button
        Container(
          width: 56,
          height: 56,
          decoration: BoxDecoration(
            color: AppColors.primary,
            shape: BoxShape.circle,
          ),
          child: const Icon(Icons.pause, color: Colors.white, size: 28),
        ),
      ],
    );
  }
}

// Skeleton loader with shimmer animation
class _SkeletonLoader extends StatefulWidget {
  final double width;
  final double height;
  
  const _SkeletonLoader({
    required this.width,
    required this.height,
  });

  @override
  State<_SkeletonLoader> createState() => _SkeletonLoaderState();
}

class _SkeletonLoaderState extends State<_SkeletonLoader> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _animation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(milliseconds: 1500),
      vsync: this,
    )..repeat();
    
    _animation = Tween<double>(begin: -1.0, end: 2.0).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _animation,
      builder: (context, child) {
        return Container(
          width: widget.width,
          height: widget.height,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(8),
            gradient: LinearGradient(
              begin: Alignment.centerLeft,
              end: Alignment.centerRight,
              colors: [
                Colors.grey.shade200,
                Colors.grey.shade100,
                Colors.grey.shade200,
              ],
              stops: [
                (_animation.value - 0.3).clamp(0.0, 1.0),
                _animation.value.clamp(0.0, 1.0),
                (_animation.value + 0.3).clamp(0.0, 1.0),
              ],
            ),
          ),
        );
      },
    );
  }
}
