import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../Utils/token_provider.dart';

class Main extends StatelessWidget {
  const Main({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final textStyle = TextStyle(
      fontSize: 24,
      fontWeight: FontWeight.bold,
      color: Colors.black,
    );

    return Scaffold(
      body: Center(
        child: Consumer(builder: (context, ref, _) {
          final authState = ref.watch(authProvider);
          if (authState.isAuthenticated && authState.token != null) {
            return Text(
              'Welcome to Photomoto! Token: ${authState.token}',
              style: textStyle,
            );
          } else {
            return Text(
              'Welcome to Photomoto!',
              style: textStyle,
            );
          }
        }),
      ),
    );
  }
}
