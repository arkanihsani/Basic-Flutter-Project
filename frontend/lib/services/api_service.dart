import 'dart:convert';
import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class ApiException implements Exception {
  final String message;
  final int? statusCode;

  ApiException(this.message, [this.statusCode]);

  @override
  String toString() => 'ApiException: $message';
}

class ApiService {
  // Auto-detect the correct base URL based on platform
  static String get baseUrl {
    if (kIsWeb) {
      return 'http://localhost:3000/api/v1';
    } else if (Platform.isAndroid) {
      // Android emulator uses 10.0.2.2 to access host machine's localhost
      return 'http://10.0.2.2:3000/api/v1';
    } else if (Platform.isIOS) {
      return 'http://localhost:3000/api/v1';
    } else {
      // Default fallback
      return 'http://localhost:3000/api/v1';
    }
  }
  
  static const _storage = FlutterSecureStorage();

  // Auth token management
  static Future<String?> getToken() async {
    return await _storage.read(key: 'auth_token');
  }

  static Future<void> setToken(String token) async {
    await _storage.write(key: 'auth_token', value: token);
  }

  static Future<void> removeToken() async {
    await _storage.delete(key: 'auth_token');
  }

  // HTTP headers
  static Future<Map<String, String>> _getHeaders({bool includeAuth = true}) async {
    final headers = <String, String>{
      'Content-Type': 'application/json',
    };

    if (includeAuth) {
      final token = await getToken();
      if (token != null) {
        headers['Authorization'] = 'Bearer $token';
      }
    }

    return headers;
  }

  // Generic HTTP methods
  static Future<Map<String, dynamic>> _makeRequest(
    String method,
    String endpoint, {
    Map<String, dynamic>? body,
    bool includeAuth = true,
  }) async {
    final uri = Uri.parse('$baseUrl$endpoint');
    final headers = await _getHeaders(includeAuth: includeAuth);

    // Debug print for development
    if (kDebugMode) {
      print('API Request: $method $uri');
      if (body != null) print('Body: $body');
    }

    late http.Response response;

    try {
      switch (method.toUpperCase()) {
        case 'GET':
          response = await http.get(uri, headers: headers).timeout(
            const Duration(seconds: 10),
          );
          break;
        case 'POST':
          response = await http.post(
            uri,
            headers: headers,
            body: body != null ? jsonEncode(body) : null,
          ).timeout(
            const Duration(seconds: 10),
          );
          break;
        case 'PUT':
          response = await http.put(
            uri,
            headers: headers,
            body: body != null ? jsonEncode(body) : null,
          ).timeout(
            const Duration(seconds: 10),
          );
          break;
        case 'DELETE':
          response = await http.delete(uri, headers: headers).timeout(
            const Duration(seconds: 10),
          );
          break;
        default:
          throw ApiException('Unsupported HTTP method: $method');
      }
    } catch (e) {
      if (kDebugMode) {
        print('API Error: $e');
        print('Trying to connect to: $baseUrl');
      }
      
      if (e is SocketException) {
        throw ApiException(
          'Cannot connect to server. Make sure:\n'
          '1. Backend server is running on port 3000\n'
          '2. You are using the correct IP address\n'
          'Current URL: $baseUrl'
        );
      }
      throw ApiException('Request failed: ${e.toString()}');
    }

    return _handleResponse(response);
  }

  static Map<String, dynamic> _handleResponse(http.Response response) {
    final data = jsonDecode(response.body) as Map<String, dynamic>;

    if (response.statusCode >= 200 && response.statusCode < 300) {
      return data;
    } else {
      throw ApiException(
        data['message'] ?? 'Unknown error occurred',
        response.statusCode,
      );
    }
  }

  // Simple GET method for testing
  static Future<Map<String, dynamic>> get(String endpoint, {bool includeAuth = true}) async {
    return await _makeRequest('GET', endpoint, includeAuth: includeAuth);
  }

  // Authentication endpoints
  static Future<Map<String, dynamic>> login(String email, String password) async {
    return await _makeRequest(
      'POST',
      '/auth/login',
      body: {'email': email, 'password': password},
      includeAuth: false,
    );
  }

  static Future<Map<String, dynamic>> register(
    String username,
    String email,
    String password,
  ) async {
    return await _makeRequest(
      'POST',
      '/auth/register',
      body: {
        'username': username,
        'email': email,
        'password': password,
      },
      includeAuth: false,
    );
  }

  static Future<Map<String, dynamic>> getProfile() async {
    return await _makeRequest('GET', '/auth/me');
  }

  static Future<Map<String, dynamic>> updateProfile(
    String username,
    String email,
  ) async {
    return await _makeRequest(
      'PUT',
      '/auth/me',
      body: {'username': username, 'email': email},
    );
  }

  static Future<Map<String, dynamic>> deleteProfile() async {
    return await _makeRequest('DELETE', '/auth/me');
  }

  // Record endpoints
  static Future<Map<String, dynamic>> getRecords() async {
    return await _makeRequest('GET', '/record');
  }

  static Future<Map<String, dynamic>> getRecord(String id) async {
    return await _makeRequest('GET', '/record/$id');
  }

  static Future<Map<String, dynamic>> createRecord(
    Map<String, dynamic> recordData,
  ) async {
    return await _makeRequest('POST', '/record', body: recordData);
  }

  static Future<Map<String, dynamic>> updateRecord(
    String id,
    Map<String, dynamic> recordData,
  ) async {
    return await _makeRequest('PUT', '/record/$id', body: recordData);
  }

  static Future<Map<String, dynamic>> deleteRecord(String id) async {
    return await _makeRequest('DELETE', '/record/$id');
  }
}