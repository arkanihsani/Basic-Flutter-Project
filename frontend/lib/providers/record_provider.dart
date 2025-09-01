import 'package:flutter/material.dart';
import '../models/record.dart';
import '../services/api_service.dart';

class RecordProvider with ChangeNotifier {
  List<Record> _records = [];
  bool _isLoading = false;
  String? _error;

  List<Record> get records => _records;
  bool get isLoading => _isLoading;
  String? get error => _error;

  // Computed properties
  double get totalIncome {
    return _records
        .where((record) => record.type == RecordType.income)
        .fold(0.0, (sum, record) => sum + record.amount);
  }

  double get totalExpenditure {
    return _records
        .where((record) => record.type == RecordType.expenditure)
        .fold(0.0, (sum, record) => sum + record.amount);
  }

  double get balance => totalIncome - totalExpenditure;

  List<Record> get incomeRecords =>
      _records.where((record) => record.type == RecordType.income).toList();

  List<Record> get expenditureRecords =>
      _records.where((record) => record.type == RecordType.expenditure).toList();

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

  Future<void> fetchRecords() async {
    try {
      _clearError();
      _setLoading(true);

      final response = await ApiService.getRecords();
      final recordsData = response['data'] as List;
      _records = recordsData.map((json) => Record.fromJson(json)).toList();

      // Sort records by creation date (newest first)
      _records.sort((a, b) => b.createdAt.compareTo(a.createdAt));

      _setLoading(false);
    } catch (e) {
      _setError(e.toString());
      _setLoading(false);
    }
  }

  Future<bool> createRecord(Record record) async {
    try {
      _clearError();
      _setLoading(true);

      final response = await ApiService.createRecord(record.toCreateJson());
      final newRecord = Record.fromJson(response['data']);

      _records.insert(0, newRecord); // Add to beginning
      _setLoading(false);
      return true;
    } catch (e) {
      _setError(e.toString());
      _setLoading(false);
      return false;
    }
  }

  Future<bool> updateRecord(String id, Record updatedRecord) async {
    try {
      _clearError();
      _setLoading(true);

      final response = await ApiService.updateRecord(id, updatedRecord.toUpdateJson());
      final newRecord = Record.fromJson(response['data']);

      final index = _records.indexWhere((record) => record.id == id);
      if (index != -1) {
        _records[index] = newRecord;
      }

      _setLoading(false);
      return true;
    } catch (e) {
      _setError(e.toString());
      _setLoading(false);
      return false;
    }
  }

  Future<bool> deleteRecord(String id) async {
    try {
      _clearError();
      _setLoading(true);

      await ApiService.deleteRecord(id);
      _records.removeWhere((record) => record.id == id);

      _setLoading(false);
      return true;
    } catch (e) {
      _setError(e.toString());
      _setLoading(false);
      return false;
    }
  }

  void clearRecords() {
    _records.clear();
    _clearError();
    notifyListeners();
  }
}
