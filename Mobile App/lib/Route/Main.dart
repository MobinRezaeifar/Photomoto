import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:myapp/components/Global/Direct.dart';
import '../Utils/token_provider.dart'; // اطمینان حاصل کنید که این فایل پرووایدر شما است

class Main extends StatelessWidget {
  const Main({Key? key}) : super(key: key);
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Consumer(
          builder: (context, ref, _) {
            final clickedIcon = ref.watch(clickedIconProvider);
            final username = ref.watch(authProvider).username;
            return Container(
              child: Column(
                children: [
                  Expanded(
                      child: SingleChildScrollView(
                    child: ref.read(clickedIconProvider.notifier).state == 'me'
                        ? Direct(username: username)
                        : Text(
                            "Issue",
                            style: TextStyle(color: Colors.white),
                          ),
                  )),
                  Container(
                    color: Color(0xFF002733),
                    padding: EdgeInsets.all(16),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceAround,
                      children: [
                        IconButton(
                          icon: Icon(Icons.account_circle, color: Colors.white),
                          onPressed: () {
                            ref.read(clickedIconProvider.notifier).state = 'me';
                            print(ref.read(clickedIconProvider.notifier).state);
                          },
                        ),
                        IconButton(
                          icon: Icon(Icons.connect_without_contact,
                              color: Colors.white),
                          onPressed: () {
                            ref.read(clickedIconProvider.notifier).state =
                                'connection';
                            print(ref.read(clickedIconProvider.notifier).state);
                          },
                        ),
                        IconButton(
                          icon: Icon(Icons.search, color: Colors.white),
                          onPressed: () {
                            ref.read(clickedIconProvider.notifier).state =
                                'search';
                            print(ref.read(clickedIconProvider.notifier).state);
                          },
                        ),
                        IconButton(
                          icon: Icon(Icons.chat, color: Colors.white),
                          onPressed: () {
                            ref.read(clickedIconProvider.notifier).state =
                                'chat';
                            print(ref.read(clickedIconProvider.notifier).state);
                          },
                        ),
                        IconButton(
                          icon: Icon(Icons.home, color: Colors.white),
                          onPressed: () {
                            ref.read(clickedIconProvider.notifier).state =
                                'home';
                            print(ref.read(clickedIconProvider.notifier).state);
                          },
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            );
          },
        ),
      ),
    );
  }
}
