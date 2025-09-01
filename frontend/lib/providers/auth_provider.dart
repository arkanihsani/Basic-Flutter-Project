import 'package:flutter/material.dart';
import '../models/user.dart';
import '../services/api_service.dart';

class AuthProvider with ChangeNotifier {
  User? _user;
  bool _isLoading = false;
  String? _error;

  User? get user => _user;
  bool get isLoading => _isLoading;
  String? get error => _error;
  bool get isAuthenticated => _user != null;

  void _setLoading(bool loading) {
    _isLoading = loading;
    notifyListeners();
  }

  void _setError(String? error) {
    _error = error;
    notifyListeners();
  }

  void _clearError() {
    _error = null;
  }

  Future<bool> login(String email, String password) async {
    try {
      _clearError();
      _setLoading(true);

      final response = await ApiService.login(email, password);
      final token = response['data']['token'];
      final userData = response['data']['user'];

      await ApiService.setToken(token);
      _user = User.fromJson(userData);

      _setLoading(false);
      return true;
    } catch (e) {
      _setError(e.toString());
      _setLoading(false);
      return false;
    }
  }

  Future<bool> register(String username, String email, String password) async {
    try {
      _clearError();
      _setLoading(true);

      final response = await ApiService.register(username, email, password);
      final token = response['data']['token'];
      final userData = response['data']['user'];

      await ApiService.setToken(token);
      _user = User.fromJson(userData);

      _setLoading(false);
      return true;
    } catch (e) {
      _setError(e.toString());
      _setLoading(false);
      return false;
    }
  }

  Future<void> logout() async {
    try {
      await ApiService.removeToken();
      _user = null;
      _clearError();
      notifyListeners();
    } catch (e) {
      _setError(e.toString());
    }
  }

  Future<bool> checkAuthStatus() async {
    try {
      final token = await ApiService.getToken();
      if (token == null) return false;

      final response = await ApiService.getProfile();
      _user = User.fromJson(response['data']);
      notifyListeners();
      return true;
    } catch (e) {
      await ApiService.removeToken();
      _user = null;
      notifyListeners();
      return false;
    }
  }

  Future<bool> updateProfile(String username, String email) async {
    try {
      _clearError();
      _setLoading(true);

      final response = await ApiService.updateProfile(username, email);
      _user = User.fromJson(response['data']);

      _setLoading(false);
      return true;
    } catch (e) {
      _setError(e.toString());
      _setLoading(false);
      return false;
    }
  }

  Future<bool> deleteAccount() async {
    try {
      _clearError();
      _setLoading(true);

      await ApiService.deleteProfile();
      await logout();

      _setLoading(false);
      return true;
    } catch (e) {
      _setError(e.toString());
      _setLoading(false);
      return false;
    }
  }
}
