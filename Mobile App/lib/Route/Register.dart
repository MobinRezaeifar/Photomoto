// ignore_for_file: prefer_const_constructors
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import '../Utils/api_urls.dart';
import 'package:encrypt/encrypt.dart' as encrypt;
import 'package:convert/convert.dart';
import '../Utils/token_provider.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:fluttertoast/fluttertoast.dart';

class User {
  String username;
  String password;
  String fullName;
  String email;
  String gender;
  String hash;
  int post;
  List<dynamic> connection;
  String bio;
  String profileImg;

  User({
    this.username = '',
    this.password = '',
    this.fullName = '',
    this.email = '',
    this.gender = '',
    this.hash = '',
    this.post = 0,
    this.profileImg = "https://wallpapercave.com/dwp1x/wp9566386.jpg",
    this.connection = const [],
    String? bio,
  }) : this.bio = bio ??
            'Hello, I\'m ' +
                (fullName.isNotEmpty ? fullName : 'a new member') +
                ' and I just became a member of Photomoto platform';

  Map<String, dynamic> toJson() => {
        'username': username,
        'password': password,
        'fullName': fullName,
        'email': email,
        'gender': gender,
        'hash': hash,
        'post': post,
        'connection': connection,
        'bio': bio,
        "profileImg": profileImg
      };
}

class Register extends StatefulWidget {
  const Register({Key? key}) : super(key: key);

  @override
  _RegisterState createState() => _RegisterState();
}

final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();
bool _isLoading = false;

class _RegisterState extends State<Register> {
  final _user = User();

  void _submitRegister(BuildContext context, WidgetRef ref) async {
    if (_user.password.isNotEmpty &&
        _user.username.isNotEmpty &&
        _user.email.isNotEmpty &&
        _user.gender.isNotEmpty &&
        _user.fullName.isNotEmpty) {
      final apiUrl = APIUrls.baseUrlDotenet + "api/Registers";
      final jsonData = json.encode(_user.toJson());

      try {
        final response = await http.post(
          Uri.parse(apiUrl),
          headers: <String, String>{
            'Content-Type': 'application/json; charset=UTF-8',
          },
          body: jsonData,
        );
        if (response.statusCode == 200) {
          final responseData = json.decode(response.body);
          final token = responseData['token'];
          ref.read(authProvider.notifier).setToken(token, _user.username);
          Navigator.pushReplacementNamed(context, '/photomoto');
          print('Data submitted successfully');
        } else {
          print('Failed to submit data: ${response.statusCode}');
        }
      } catch (error) {
        print('Error submitting data: $error');
      }
    }
  }

  void _submitLogin(
      BuildContext context, WidgetRef ref, VoidCallback onComplete) async {
    if (_user.password.isNotEmpty && _user.username.isNotEmpty) {
      setState(() {
        _isLoading = true;
      });

      final apiUrl = APIUrls.baseUrlDotenet + "api/Registers/login";
      try {
        final response = await http.post(
          Uri.parse(apiUrl),
          headers: <String, String>{
            'Content-Type': 'application/json; charset=UTF-8',
          },
          body: jsonEncode(<String, String>{
            'username': _user.username,
            'password': _user.password,
          }),
        );
        if (response.statusCode == 200) {
          final responseData = json.decode(response.body);
          final token = responseData['token'];
          ref.read(authProvider.notifier).setToken(token, _user.username);
          Navigator.pushReplacementNamed(context, '/photomoto');
          print('Data submitted successfully');
          onComplete();
        } else {
          Fluttertoast.showToast(
            msg: 'Failed to submit data: ${response.statusCode}',
            toastLength: Toast.LENGTH_SHORT,
            gravity: ToastGravity.TOP,
            timeInSecForIosWeb: 3,
            backgroundColor: Color(0xFF000000),
            textColor: Colors.white,
            fontSize: 16.0,
          );

          setState(() {
            _isLoading = false;
          });
          onComplete();
        }
      } catch (error) {
        print('Error submitting data: $error');
      } finally {
        setState(() {
          _isLoading = false;
        });
        onComplete();
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Consumer(builder: (context, ref, _) {
      return Scaffold(
        body: Center(
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Container(
              padding: const EdgeInsets.all(16.0),
              decoration: BoxDecoration(
                color: const Color(0xFF001925),
                borderRadius: BorderRadius.circular(12.0),
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Row(
                    mainAxisAlignment: MainAxisAlignment.start,
                    children: [
                      Icon(
                        Icons.camera_alt,
                        color: Colors.white,
                        size: 24.0,
                      ),
                      const SizedBox(width: 8.0),
                      Text(
                        'Photomoto',
                        style: TextStyle(
                          fontSize: 24.0,
                          color: Colors.white,
                          fontWeight: FontWeight.w800,
                        ),
                      ),
                    ],
                  ),
                  SizedBox(height: 16.0),
                  TextField(
                    onChanged: (value) {
                      setState(() {
                        _user.username = value;
                      });
                    },
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 18.0,
                    ),
                    decoration: InputDecoration(
                      filled: true,
                      fillColor: Color(0xFF002733),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(8.0),
                        borderSide: BorderSide(
                          color: Color(0xFF4A5568),
                        ),
                      ),
                      enabledBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(8.0),
                        borderSide: BorderSide(
                          color: Color(0xFF4A5568),
                        ),
                      ),
                      focusedBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(8.0),
                        borderSide: BorderSide(
                          color: Color(0xFF3B82F6),
                          width: 2.0,
                        ),
                      ),
                      hintText: 'Username...',
                      hintStyle: TextStyle(
                        color: Color(0xFF9CA3AF),
                      ),
                      contentPadding: EdgeInsets.symmetric(
                          vertical: 14.0, horizontal: 10.0),
                      prefixIcon:
                          Icon(Icons.alternate_email, color: Color(0xFF9CA3AF)),
                    ),
                  ),
                  SizedBox(height: 16.0),
                  TextField(
                    onChanged: (value) {
                      setState(() {
                        _user.password = value;
                      });
                    },
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 18.0,
                    ),
                    decoration: InputDecoration(
                      filled: true,
                      fillColor: Color(0xFF002733),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(8.0),
                        borderSide: BorderSide(
                          color: Color(0xFF4A5568),
                        ),
                      ),
                      enabledBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(8.0),
                        borderSide: BorderSide(
                          color: Color(0xFF4A5568),
                        ),
                      ),
                      focusedBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(8.0),
                        borderSide: BorderSide(
                          color: Color(0xFF3B82F6),
                          width: 2.0,
                        ),
                      ),
                      hintText: 'Password...',
                      hintStyle: TextStyle(
                        color: Color(0xFF9CA3AF),
                      ),
                      contentPadding: EdgeInsets.symmetric(
                          vertical: 14.0, horizontal: 10.0),
                      prefixIcon:
                          Icon(Icons.password, color: Color(0xFF9CA3AF)),
                    ),
                  ),
                  SizedBox(height: 16.0),
                  TextField(
                    onChanged: (value) {
                      setState(() {
                        _user.fullName = value;
                      });
                    },
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 18.0,
                    ),
                    decoration: InputDecoration(
                      filled: true,
                      fillColor: Color(0xFF002733),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(8.0),
                        borderSide: BorderSide(
                          color: Color(0xFF4A5568),
                        ),
                      ),
                      enabledBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(8.0),
                        borderSide: BorderSide(
                          color: Color(0xFF4A5568),
                        ),
                      ),
                      focusedBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(8.0),
                        borderSide: BorderSide(
                          color: Color(0xFF3B82F6),
                          width: 2.0,
                        ),
                      ),
                      hintText: 'FullName...',
                      hintStyle: TextStyle(
                        color: Color(0xFF9CA3AF),
                      ),
                      contentPadding: EdgeInsets.symmetric(
                          vertical: 14.0, horizontal: 10.0),
                      prefixIcon: Icon(Icons.person, color: Color(0xFF9CA3AF)),
                    ),
                  ),
                  SizedBox(height: 16.0),
                  TextField(
                    onChanged: (value) {
                      setState(() {
                        _user.email = value;
                      });
                    },
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 18.0,
                    ),
                    decoration: InputDecoration(
                      filled: true,
                      fillColor: Color(0xFF002733),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(8.0),
                        borderSide: BorderSide(
                          color: Color(0xFF4A5568),
                        ),
                      ),
                      enabledBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(8.0),
                        borderSide: BorderSide(
                          color: Color(0xFF4A5568),
                        ),
                      ),
                      focusedBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(8.0),
                        borderSide: BorderSide(
                          color: Color(0xFF3B82F6),
                          width: 2.0,
                        ),
                      ),
                      hintText: 'Email...',
                      hintStyle: TextStyle(
                        color: Color(0xFF9CA3AF),
                      ),
                      contentPadding: EdgeInsets.symmetric(
                          vertical: 14.0, horizontal: 10.0),
                      prefixIcon:
                          Icon(Icons.attach_email, color: Color(0xFF9CA3AF)),
                    ),
                  ),
                  SizedBox(height: 16.0),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: <Widget>[
                      InkWell(
                        onTap: () {
                          setState(() {
                            _user.gender = 'male';
                          });
                        },
                        child: Container(
                          width: 80,
                          height: 80,
                          decoration: BoxDecoration(
                            color: _user.gender == 'male'
                                ? const Color.fromARGB(138, 33, 149, 243)
                                : Color(0xFF002733),
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: Column(
                            mainAxisSize: MainAxisSize.min,
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: <Widget>[
                              Icon(Icons.male, size: 25, color: Colors.white),
                              SizedBox(height: 8),
                              Text(
                                'Male',
                                style: TextStyle(
                                    color: Colors.white,
                                    fontSize: 12,
                                    fontWeight: FontWeight.bold),
                              ),
                            ],
                          ),
                        ),
                      ),
                      InkWell(
                        onTap: () {
                          setState(() {
                            _user.gender = 'other';
                          });
                        },
                        child: Container(
                          width: 80,
                          height: 80,
                          decoration: BoxDecoration(
                            color: _user.gender == 'other'
                                ? const Color.fromARGB(138, 33, 149, 243)
                                : Color(0xFF002733),
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: Column(
                            mainAxisSize: MainAxisSize.min,
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: <Widget>[
                              Icon(Icons.account_circle,
                                  size: 22, color: Colors.white),
                              SizedBox(height: 9),
                              Text(
                                'Other',
                                style: TextStyle(
                                    color: Colors.white,
                                    fontSize: 12,
                                    fontWeight: FontWeight.bold),
                              ),
                            ],
                          ),
                        ),
                      ),
                      InkWell(
                        onTap: () {
                          setState(() {
                            _user.gender = 'female';
                          });
                        },
                        child: Container(
                          width: 80,
                          height: 80,
                          decoration: BoxDecoration(
                            color: _user.gender == 'female'
                                ? const Color.fromARGB(138, 33, 149, 243)
                                : Color(0xFF002733),
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: Column(
                            mainAxisSize: MainAxisSize.min,
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: <Widget>[
                              Icon(Icons.female, size: 30, color: Colors.white),
                              SizedBox(height: 3),
                              Text(
                                'Female',
                                style: TextStyle(
                                    color: Colors.white,
                                    fontSize: 12,
                                    fontWeight: FontWeight.bold),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12.0),
                  InkWell(
                    onTap: () {
                      showModalBottomSheet(
                        context: context,
                        builder: (BuildContext context) {
                          return StatefulBuilder(
                            builder: (BuildContext context,
                                StateSetter setModalState) {
                              return Container(
                                padding: const EdgeInsets.all(16.0),
                                color: const Color(0xFF001925),
                                child: Column(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    Row(
                                      mainAxisAlignment:
                                          MainAxisAlignment.spaceBetween,
                                      children: [
                                        Row(
                                          children: [
                                            Icon(
                                              Icons.login,
                                              color: Colors.white,
                                            ),
                                            const SizedBox(width: 8.0),
                                            const Text(
                                              'Login',
                                              style: TextStyle(
                                                fontSize: 24.0,
                                                color: Colors.white,
                                              ),
                                            ),
                                          ],
                                        ),
                                        _isLoading
                                            ? CircularProgressIndicator(
                                                color: Colors.green,
                                              )
                                            : GestureDetector(
                                                onTap: () {
                                                  setModalState(() {
                                                    _isLoading = true;
                                                  });
                                                  _submitLogin(context, ref,
                                                      () {
                                                    setModalState(() {
                                                      _isLoading = false;
                                                    });
                                                  });
                                                },
                                                child: Icon(
                                                  Icons.check,
                                                  size: 30.0,
                                                  color: Colors.green,
                                                ),
                                              ),
                                      ],
                                    ),
                                    const SizedBox(height: 16.0),
                                    TextField(
                                      onChanged: (value) {
                                        setState(() {
                                          _user.username = value;
                                        });
                                      },
                                      style: TextStyle(
                                        color: Colors.white,
                                        fontSize: 18.0,
                                      ),
                                      decoration: InputDecoration(
                                        filled: true,
                                        fillColor: Color(0xFF002733),
                                        border: OutlineInputBorder(
                                          borderRadius:
                                              BorderRadius.circular(8.0),
                                          borderSide: BorderSide(
                                            color: Color(0xFF4A5568),
                                          ),
                                        ),
                                        enabledBorder: OutlineInputBorder(
                                          borderRadius:
                                              BorderRadius.circular(8.0),
                                          borderSide: BorderSide(
                                            color: Color(0xFF4A5568),
                                          ),
                                        ),
                                        focusedBorder: OutlineInputBorder(
                                          borderRadius:
                                              BorderRadius.circular(8.0),
                                          borderSide: BorderSide(
                                            color: Color(0xFF3B82F6),
                                            width: 2.0,
                                          ),
                                        ),
                                        hintText: 'Username...',
                                        hintStyle: TextStyle(
                                          color: Color(0xFF9CA3AF),
                                        ),
                                        contentPadding: EdgeInsets.symmetric(
                                            vertical: 14.0, horizontal: 10.0),
                                        prefixIcon: Icon(Icons.alternate_email,
                                            color: Color(0xFF9CA3AF)),
                                      ),
                                    ),
                                    SizedBox(height: 16.0),
                                    TextField(
                                      onChanged: (value) {
                                        setState(() {
                                          _user.password = value;
                                        });
                                      },
                                      style: TextStyle(
                                        color: Colors.white,
                                        fontSize: 18.0,
                                      ),
                                      decoration: InputDecoration(
                                        filled: true,
                                        fillColor: Color(0xFF002733),
                                        border: OutlineInputBorder(
                                          borderRadius:
                                              BorderRadius.circular(8.0),
                                          borderSide: BorderSide(
                                            color: Color(0xFF4A5568),
                                          ),
                                        ),
                                        enabledBorder: OutlineInputBorder(
                                          borderRadius:
                                              BorderRadius.circular(8.0),
                                          borderSide: BorderSide(
                                            color: Color(0xFF4A5568),
                                          ),
                                        ),
                                        focusedBorder: OutlineInputBorder(
                                          borderRadius:
                                              BorderRadius.circular(8.0),
                                          borderSide: BorderSide(
                                            color: Color(0xFF3B82F6),
                                            width: 2.0,
                                          ),
                                        ),
                                        hintText: 'Password...',
                                        hintStyle: TextStyle(
                                          color: Color(0xFF9CA3AF),
                                        ),
                                        contentPadding: EdgeInsets.symmetric(
                                            vertical: 14.0, horizontal: 10.0),
                                        prefixIcon: Icon(Icons.password,
                                            color: Color(0xFF9CA3AF)),
                                      ),
                                    ),
                                  ],
                                ),
                              );
                            },
                          );
                        },
                      );
                    },
                    child: Row(
                      children: [
                        Icon(
                          Icons.login,
                          color: Color(0xFF9CA3AF),
                        ),
                        SizedBox(width: 8),
                        Text(
                          'Login',
                          style: TextStyle(
                              color: Color(0xFF9CA3AF), fontSize: 20.0),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 16.0),
                  SizedBox(
                    width: double.infinity,
                    height: 50.0,
                    child: ElevatedButton(
                      onPressed: () {
                        _submitRegister(context, ref);
                      },
                      style: ElevatedButton.styleFrom(
                        foregroundColor: Colors.orange,
                        backgroundColor: const Color(0xFF002733),
                        side: const BorderSide(
                          color: Colors.orange,
                          width: 2.0,
                        ),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8.0),
                          side: const BorderSide(
                            color: Colors.orange,
                            width: 20.0,
                          ),
                        ),
                        padding: const EdgeInsets.symmetric(
                            horizontal: 24.0, vertical: 12.0),
                        textStyle: const TextStyle(
                          fontSize: 18.0,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      child: const Text('Submit'),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      );
    });
  }
}
