import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import '../../Utils/api_urls.dart';

class Direct extends StatefulWidget {
  final String? username;

  const Direct({Key? key, this.username}) : super(key: key);

  @override
  _DirectState createState() => _DirectState();
}

class _DirectState extends State<Direct> {
  List<String> _data = [];

  @override
  void initState() {
    super.initState();
    fetchData();
  }

  Future<void> fetchData() async {
    final response = await http
        .get(Uri.parse(APIUrls.baseUrlDotenet + "api/ConnectionHandel"));

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

            if (existingUser != null) {
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
    return Column(
  children: [
    Padding(
      padding: const EdgeInsets.only(top: 16.0), // Adjust the value as needed
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Icon(Icons.chat, color: Colors.white,size: 20.0,),
          SizedBox(width: 8),
          Text("Direct", style: TextStyle(color: Colors.white,fontSize: 20.0)),
        ],
      ),
    ),
    ..._data.map((user) => ListTile(
          title: Text(user, style: TextStyle(color: Colors.white)),
        )).toList(),
  ],
);

  }
}
