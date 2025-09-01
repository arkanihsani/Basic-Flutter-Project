enum RecordType {
  income('INCOME'),
  expenditure('EXPENDITURE');

  const RecordType(this.value);
  final String value;

  static RecordType fromString(String value) {
    switch (value.toUpperCase()) {
      case 'INCOME':
        return RecordType.income;
      case 'EXPENDITURE':
        return RecordType.expenditure;
      default:
        throw ArgumentError('Invalid record type: $value');
    }
  }

  String get displayName {
    switch (this) {
      case RecordType.income:
        return 'Income';
      case RecordType.expenditure:
        return 'Expenditure';
    }
  }
}

class Record {
  final String id;
  final String userId;
  final double amount;
  final String? description;
  final RecordType type;
  final DateTime createdAt;
  final DateTime updatedAt;

  Record({
    required this.id,
    required this.userId,
    required this.amount,
    this.description,
    required this.type,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Record.fromJson(Map<String, dynamic> json) {
    return Record(
      id: json['id'],
      userId: json['user_id'],
      amount: json['amount'].toDouble(),
      description: json['description'],
      type: RecordType.fromString(json['type']),
      createdAt: DateTime.parse(json['created_at']),
      updatedAt: DateTime.parse(json['updated_at']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'user_id': userId,
      'amount': amount,
      'description': description,
      'type': type.value,
      'created_at': createdAt.toIso8601String(),
      'updated_at': updatedAt.toIso8601String(),
    };
  }

  Map<String, dynamic> toCreateJson() {
    return {
      'amount': amount,
      'description': description,
      'type': type.value,
    };
  }

  Map<String, dynamic> toUpdateJson() {
    return {
      'amount': amount,
      'description': description,
      'type': type.value,
    };
  }

  Record copyWith({
    String? id,
    String? userId,
    double? amount,
    String? description,
    RecordType? type,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return Record(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      amount: amount ?? this.amount,
      description: description ?? this.description,
      type: type ?? this.type,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }
}
