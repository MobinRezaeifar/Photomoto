import 'package:flutter/material.dart';
import 'package:flutter_web_plugins/flutter_web_plugins.dart';
import 'package:myapp/Route/Main.dart';
import 'package:myapp/Route/Register.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

void main() {
  setUrlStrategy(PathUrlStrategy());
  runApp(ProviderScope(child: MyApp()));
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Photomoto',
      theme: ThemeData(
        useMaterial3: true,
        colorScheme:
            ColorScheme.fromSeed(seedColor: Colors.deepPurple).copyWith(
          background: const Color(0xFF1d232a),
        ),
      ),
      initialRoute: '/',
      routes: {
        '/': (context) => const Register(),
        '/photomoto': (context) => const Main(),
      },
    );
  }
}
