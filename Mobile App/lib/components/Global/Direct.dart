import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import '../../Utils/api_urls.dart';
import '../../Utils/token_provider.dart';

class Direct extends ConsumerStatefulWidget {
  final String? username;

  const Direct({Key? key, this.username}) : super(key: key);

  @override
  _DirectState createState() => _DirectState();
}

class _DirectState extends ConsumerState<Direct> {
  List<String> _data = [];
  String? _selectedUser = "";

  @override
  void initState() {
    super.initState();
    fetchData();
  }

  Future<void> fetchData() async {
    final authState = ref.read(authProvider);
    if (authState.token == null) {
      throw Exception('Token is null');
    }

    final response = await http.get(
      Uri.parse(APIUrls.baseUrlDotenet + "api/ConnectionHandel"),
      headers: {
        'Authorization': 'Bearer ${authState.token}',
      },
    );

    if (response.statusCode == 200) {
      final List<dynamic> connections = json.decode(response.body);
      final List<String> users = [];

      connections.forEach((data) {
        if (data['sender'] == widget.username ||
            data['receiver'] == widget.username) {
          final targetUser = data['sender'] == widget.username
              ? data['receiver']
              : data['sender'];

          if (data['status'] == "accept") {
            final existingUser = users.firstWhere(
              (user) => user == targetUser,
              orElse: () => "",
            );

            if (existingUser == "") {
              users.add(targetUser);
            }
          }
        }
      });

      setState(() {
        _data = users;
      });
    } else {
      throw Exception('Failed to load data');
    }
  }

  @override
  Widget build(BuildContext context) {
    print(widget.username);
    print(_data);
    print(_selectedUser);
    print(ref.read(authProvider).token);

    return _selectedUser == ""
        ? Column(
            children: [
              Padding(
                padding: const EdgeInsets.only(top: 16.0),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    Icon(
                      Icons.chat,
                      color: Colors.white,
                      size: 20.0,
                    ),
                    SizedBox(width: 8),
                    Text("Direct",
                        style: TextStyle(color: Colors.white, fontSize: 20.0)),
                  ],
                ),
              ),
              ..._data
                  .map((user) => ListTile(
                        onTap: () {
                          setState(() {
                            _selectedUser = user;
                          });
                        },
                        leading: CircleAvatar(
                          backgroundImage: AssetImage('lib/Assets/profile.jpg'),
                        ),
                        title: Text(user,
                            style:
                                TextStyle(color: Colors.white, fontSize: 16.0)),
                      ))
                  .toList(),
            ],
          )
        : Padding(
            padding: const EdgeInsets.symmetric(horizontal: 22.0),
            child: Container(
              decoration: BoxDecoration(
                color: Color(0xFF002733),
                borderRadius: BorderRadius.only(
                  bottomLeft: Radius.circular(8.0),
                  bottomRight: Radius.circular(8.0),
                ), //
              ),
              child: Padding(
                padding: const EdgeInsets.all(8.0),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: <Widget>[
                    Row(
                      children: <Widget>[
                        CircleAvatar(
                          backgroundImage: AssetImage('lib/Assets/profile.jpg'),
                        ),
                        SizedBox(width: 8.0),
                        Text(_selectedUser!,
                            style:
                                TextStyle(color: Colors.white, fontSize: 20.0)),
                      ],
                    ),
                    IconButton(
                      icon: Icon(Icons.call, color: Colors.white),
                      onPressed: () {},
                    ),
                  ],
                ),
              ),
            ),
          );
  }
}
