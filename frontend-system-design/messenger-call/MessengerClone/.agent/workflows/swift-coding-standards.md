---
description: Swift iOS coding standards and folder structure guidelines
---

# Swift iOS Coding Standards Workflow

Follow these rules when creating Swift/SwiftUI code for iOS projects.

---

## 1. Folder Structure (Feature-Based)

```
ProjectName/
├── App/                    # Entry points
│   ├── AppNameApp.swift
│   └── ContentView.swift
├── Core/
│   ├── Constants/          # App-wide constants
│   ├── Extensions/         # Swift extensions
│   ├── Utils/             # Utility functions
│   └── Components/         # Reusable UI components
├── Features/               # Feature modules
│   └── FeatureName/
│       ├── Views/          # SwiftUI views
│       ├── ViewModels/     # @Observable ViewModels
│       └── Models/         # Data models
├── Shared/
│   ├── Views/             # Shared UI components
│   └── Models/            # Shared models
└── Resources/
    ├── Assets.xcassets
    └── Preview Content/
```

---

## 2. File Structure Template

```swift
import SwiftUI

// MARK: - StructName

/**
 Brief description of what this does.
 
 - Note: Additional notes if needed.
 */
struct StructName: View {
    
    // MARK: - Properties
    
    /// Description of property
    let propertyName: Type
    
    /// State property description
    @State private var stateName = value
    
    // MARK: - Constants
    
    private enum Constants {
        static let spacing: CGFloat = 16
        static let cornerRadius: CGFloat = 12
    }
    
    // MARK: - Body
    
    var body: some View {
        // ...
    }
    
    // MARK: - Private Views
    
    /// Description of view
    private var subviewName: some View {
        // ...
    }
    
    // MARK: - Private Methods
    
    /// Description of method
    private func methodName() {
        // ...
    }
}

// MARK: - Preview

#Preview {
    StructName()
}
```

---

## 3. Documentation Rules

// turbo
- **Every declaration** must have `///` or `/** */` documentation
- Use single sentence fragment ending with period
- Document parameters:
  ```swift
  /**
   Toggles selection of a role.
   
   - Parameter role: The role to toggle.
   - Note: Maximum of 3 roles can be selected.
   */
  func toggleRole(_ role: String) { ... }
  ```

---

## 4. Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Types/Protocols | UpperCamelCase | `ChipButton`, `SomeDelegate` |
| Properties/Methods | lowerCamelCase | `isSelected`, `handleTap()` |
| Constants | lowerCamelCase | `Constants.spacing` |
| Descriptive names | By role, not type | `greeting` not `string` |

---

## 5. Access Control

// turbo
- Use `private` for internal methods/properties
- Use `fileprivate` for top-level declarations outside types
- Extract computed views as `private var viewName: some View`

---

## 6. MARK Sections Order

```swift
// MARK: - Properties
// MARK: - Constants
// MARK: - Body
// MARK: - Private Views
// MARK: - Private Methods
// MARK: - Preview
```

---

## 7. Code Style

// turbo
- Open braces on same line: `struct Foo {`
- Trailing commas in arrays/dictionaries:
  ```swift
  let colors = [
      .red,
      .blue,
      .green,  // trailing comma
  ]
  ```
- Use `[weak self]` in escaping closures
- Use guard/if let instead of force unwrap `!`

---

## 8. ViewModel Pattern

```swift
@Observable
class FeatureViewModel {
    // MARK: - State Properties
    var isLoading = false
    
    // MARK: - Computed Properties
    var canProceed: Bool { ... }
    
    // MARK: - Actions
    func performAction() { ... }
}
```

---

## 9. Constants Pattern

```swift
private enum Constants {
    static let animationDuration: Double = 0.3
    static let maxCharacters = 200
    static let cornerRadius: CGFloat = 12
}
```

---

## 10. Protocol Conformance

// turbo
- Put protocol conformance in separate extensions:
```swift
struct MyView: View { ... }

// MARK: - SomeDelegate
extension MyView: SomeDelegate {
    func delegateMethod() { ... }
}
```
