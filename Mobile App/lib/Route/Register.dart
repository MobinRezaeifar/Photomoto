import 'package:flutter/material.dart';

class Register extends StatelessWidget {
  const Register({super.key});

  @override
  Widget build(BuildContext context) {
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
                      style: const TextStyle(
                        fontSize: 24.0,
                        color: Colors.white,
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                  ],
                ),
                SizedBox(height: 16.0),
                TextField(
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
                    contentPadding:
                        EdgeInsets.symmetric(vertical: 14.0, horizontal: 10.0),
                    prefixIcon:
                        Icon(Icons.alternate_email, color: Color(0xFF9CA3AF)),
                  ),
                ),
                SizedBox(height: 16.0),
                TextField(
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
                    contentPadding:
                        EdgeInsets.symmetric(vertical: 14.0, horizontal: 10.0),
                    prefixIcon: Icon(Icons.password, color: Color(0xFF9CA3AF)),
                  ),
                ),
                SizedBox(height: 16.0),
                TextField(
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
                    contentPadding:
                        EdgeInsets.symmetric(vertical: 14.0, horizontal: 10.0),
                    prefixIcon: Icon(Icons.person, color: Color(0xFF9CA3AF)),
                  ),
                ),
                SizedBox(height: 16.0),
                TextField(
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
                    contentPadding:
                        EdgeInsets.symmetric(vertical: 14.0, horizontal: 10.0),
                    prefixIcon:
                        Icon(Icons.attach_email, color: Color(0xFF9CA3AF)),
                  ),
                ),
                const SizedBox(height: 12.0),
                InkWell(
                  onTap: () {
                    showModalBottomSheet(
                      context: context,
                      builder: (BuildContext context) {
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
                                  Icon(
                                    Icons.check,
                                    color: Colors.green,
                                  ),
                                ],
                              ),
                              const SizedBox(height: 16.0),
                              TextField(
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
                                  prefixIcon: Icon(Icons.alternate_email,
                                      color: Color(0xFF9CA3AF)),
                                ),
                              ),
                              SizedBox(height: 16.0),
                              TextField(
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
                  child: Row(
                    children: [
                      Icon(
                        Icons.login, // آیکون مورد نظر خود را قرار دهید
                        color: Color(0xFF9CA3AF),
                      ),
                      SizedBox(width: 8), // فاصله بین آیکون و متن
                      Text(
                        'Login',
                        style:
                            TextStyle(color: Color(0xFF9CA3AF), fontSize: 20.0),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 16.0),
                SizedBox(
                  width: double.infinity,
                  height: 50.0,
                  child: ElevatedButton(
                    onPressed: () {},
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
  }
}
