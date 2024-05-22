import 'package:flutter/material.dart';

class Main extends StatelessWidget {
  const Main({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Text(
          'Welcome to Photomoto!',
          style: Theme.of(context).textTheme.headlineMedium,  
        ),
      ),
    );
  }
}
