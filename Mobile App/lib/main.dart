import 'package:flutter/material.dart';
import 'package:myapp/Route/Main.dart';
import 'package:myapp/Route/Register.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

void main() {
  runApp(ProviderScope(child: MyApp()));
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        useMaterial3: true,
        colorScheme:
            ColorScheme.fromSeed(seedColor: Colors.deepPurple).copyWith(
          background: const Color(0xFF1d232a),
        ),
      ),
      home: const Register(),
      routes: {'/photomoto': (context) => const Main()},
    );
  }
}
