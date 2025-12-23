class Language {
  final String code;
  final String name;
  final String nativeName;
  final bool isAvailable;

  const Language({
    required this.code,
    required this.name,
    required this.nativeName,
    this.isAvailable = true,
  });

  static const List<Language> targetLanguages = [
    Language(code: 'en', name: 'English', nativeName: 'English'),
    Language(code: 'es', name: 'Spanish', nativeName: 'Español'),
    Language(code: 'fr', name: 'French', nativeName: 'Français'),
    Language(code: 'ko', name: 'Korean', nativeName: '한국어'),
    Language(code: 'ja', name: 'Japanese', nativeName: '日本語'),
    Language(code: 'it', name: 'Italian', nativeName: 'Italiano'),
    Language(code: 'zh-CN', name: 'Simplified Chinese', nativeName: '简体中文', isAvailable: false),
  ];

  static const List<Language> nativeLanguages = [
    Language(code: 'ko', name: 'Korean', nativeName: '한국어'),
    Language(code: 'ja', name: 'Japanese', nativeName: '日本語'),
    Language(code: 'zh-TW', name: 'Traditional Chinese', nativeName: '繁體中文'),
    Language(code: 'zh-CN', name: 'Simplified Chinese', nativeName: '简体中文'),
    Language(code: 'es', name: 'Spanish', nativeName: 'Español'),
    Language(code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt'),
    Language(code: 'th', name: 'Thai', nativeName: 'ภาษาไทย'),
    Language(code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia'),
  ];
}
