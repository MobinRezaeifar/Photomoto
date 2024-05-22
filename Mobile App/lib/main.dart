import 'package:flutter/material.dart';
import 'package:myapp/Route/Main.dart';
import 'package:myapp/Route/Register.dart';

void main() {
  runApp(const MyApp());
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
          background:  const Color(0xFF1d232a), 
        ),
      ),
      home: const Register(),
      routes: {'/photomoto': (context) => const Main()},
    );
  }
}
