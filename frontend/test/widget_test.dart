// This is a basic Flutter widget test.
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:frontend/main.dart';

void main() {
  testWidgets('App compiles and loads splash screen', (WidgetTester tester) async {
    // Build our app and trigger a frame.
    await tester.pumpWidget(const MyApp());

    // Verify that our app starts properly with MaterialApp
    expect(find.byType(MaterialApp), findsOneWidget);
    
    // Verify the splash screen loads with the wallet icon
    expect(find.byIcon(Icons.account_balance_wallet), findsOneWidget);
  });
}
