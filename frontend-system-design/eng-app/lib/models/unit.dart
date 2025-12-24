class Unit {
  final String id;
  final int number;
  final String title;
  final String? subtitle;
  final double progress;
  final List<Lesson> lessons;

  const Unit({
    required this.id,
    required this.number,
    required this.title,
    this.subtitle,
    this.progress = 0.0,
    this.lessons = const [],
  });

  static List<Unit> sampleUnits = [
    Unit(
      id: '1',
      number: 1,
      title: 'Cuộc họp',
      subtitle: 'Meeting conversations',
      progress: 0.0,
      lessons: Lesson.sampleLessons,
    ),
    Unit(
      id: '2',
      number: 2,
      title: 'Introductions',
      subtitle: 'Introduce yourself',
      progress: 0.0,
      lessons: [],
    ),
  ];
}

class Lesson {
  final String id;
  final String title;
  final String? description;
  final LessonStatus status;
  final int? durationMinutes;

  const Lesson({
    required this.id,
    required this.title,
    this.description,
    this.status = LessonStatus.locked,
    this.durationMinutes,
  });

  static List<Lesson> sampleLessons = [
    const Lesson(
      id: '1',
      title: 'Cập nhật cho nhóm của bạn',
      description: 'Update for your group',
      status: LessonStatus.inProgress,
      durationMinutes: 5,
    ),
    const Lesson(
      id: '2',
      title: 'Basic greetings',
      description: 'Learn common greetings',
      status: LessonStatus.locked,
      durationMinutes: 8,
    ),
  ];
}

enum LessonStatus {
  locked,
  available,
  inProgress,
  completed,
}
