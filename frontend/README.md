# Financial Records Frontend

A Flutter mobile application for managing personal financial records (income and expenses).

## Features

- **User Authentication**
  - User registration and login
  - Secure token-based authentication
  - Profile management

- **Record Management**
  - Add income and expense records
  - Edit and delete records
  - View all records with detailed information

- **Dashboard**
  - Overview of financial status
  - Total income, expenses, and balance
  - Recent transactions display

- **Profile Management**
  - Edit user profile (username, email)
  - Account deletion with confirmation

## Project Structure

```
lib/
├── models/
│   ├── user.dart              # User model
│   └── record.dart            # Record model with RecordType enum
├── providers/
│   ├── auth_provider.dart     # Authentication state management
│   └── record_provider.dart   # Records state management
├── screens/
│   ├── auth/
│   │   ├── login_screen.dart    # Login screen
│   │   └── register_screen.dart # Registration screen
│   ├── records/
│   │   ├── add_record_screen.dart  # Add new record
│   │   └── edit_record_screen.dart # Edit existing record
│   ├── splash_screen.dart       # Initial loading screen
│   ├── home_screen.dart        # Main app with tabs
│   └── profile_screen.dart     # Profile editing screen
├── services/
│   └── api_service.dart       # HTTP API service
└── main.dart                  # App entry point
```

## Dependencies

- **flutter**: ^3.9.0
- **provider**: ^6.1.1 - State management
- **http**: ^1.1.0 - HTTP requests
- **flutter_secure_storage**: ^9.0.0 - Secure token storage
- **shared_preferences**: ^2.2.2 - Local preferences
- **intl**: ^0.19.0 - Date formatting and localization
- **email_validator**: ^2.1.17 - Email validation

## Backend Integration

This app is designed to work with the Node.js backend API. The API endpoints include:

### Authentication
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - User registration
- `GET /api/v1/auth/me` - Get user profile
- `PUT /api/v1/auth/me` - Update user profile
- `DELETE /api/v1/auth/me` - Delete user account

### Records
- `GET /api/v1/record` - Get all user records
- `GET /api/v1/record/:id` - Get specific record
- `POST /api/v1/record` - Create new record
- `PUT /api/v1/record/:id` - Update record
- `DELETE /api/v1/record/:id` - Delete record

## Configuration

The API base URL is configured in `lib/services/api_service.dart`:
```dart
static const String baseUrl = 'http://localhost:3000/api/v1';
```

For production, update this to your backend server URL.

## Installation and Setup

1. **Prerequisites**
   - Flutter SDK (^3.9.0)
   - Dart SDK
   - Android Studio / VS Code with Flutter extensions

2. **Install Dependencies**
   ```bash
   flutter pub get
   ```

3. **Run the App**
   ```bash
   flutter run
   ```

4. **Build for Production**
   ```bash
   # Android
   flutter build apk --release
   
   # iOS
   flutter build ios --release
   ```

## Usage

1. **First Time Setup**
   - Launch the app
   - Register a new account or login with existing credentials

2. **Managing Records**
   - Use the Dashboard tab to view financial overview
   - Navigate to Records tab to see all transactions
   - Tap the '+' button to add new income or expense records
   - Tap on any record to edit or delete it

3. **Profile Management**
   - Go to Profile tab to view user information
   - Tap "Edit Profile" to update username or email
   - Use logout option to securely sign out

## Security Features

- Secure token storage using Flutter Secure Storage
- Input validation for all forms
- Error handling for network requests
- Automatic token refresh and logout on authentication errors

## State Management

The app uses Provider pattern for state management:

- **AuthProvider**: Manages user authentication state
- **RecordProvider**: Manages financial records and calculations

## UI/UX Features

- Material 3 design system
- Responsive layout for different screen sizes
- Loading states and error handling
- Pull-to-refresh functionality
- Confirmation dialogs for destructive actions
- Smooth navigation with proper routing

## Development Notes

- The app follows Flutter best practices
- Code is organized into logical modules
- Proper error handling and user feedback
- Form validation with user-friendly messages
- Efficient state management with minimal rebuilds
