const InvariantError = require('./InvariantError');

const DomainErrorTranslator = {
  translate(error) {
    return DomainErrorTranslator._directories[error.message] || error;
  },
};

DomainErrorTranslator._directories = {
  'REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada'),
  'REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat membuat user baru karena tipe data tidak sesuai'),
  'REGISTER_USER.USERNAME_LIMIT_CHAR': new InvariantError('tidak dapat membuat user baru karena karakter username melebihi batas limit'),
  'REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER': new InvariantError('tidak dapat membuat user baru karena username mengandung karakter terlarang'),
  'USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('harus mengirimkan username dan password'),
  'USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('username dan password harus string'),
  'REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN': new InvariantError('harus mengirimkan token refresh'),
  'REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('refresh token harus string'),
  'DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN': new InvariantError('harus mengirimkan token refresh'),
  'DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('refresh token harus string'),
  'ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('missing required properties'),
  'ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('provided data types are invalid'),
  'ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('missing required properties'),
  'ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('provided data types are invalid'),
  'ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('missing required properties'),
  'ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('provided data types are invalid'),
  'DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('missing required property thread ID'),
  'DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('provided thread ID is invalid'),
  'DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('missing required comment ID'),
  'DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('provided comment ID is invalid'),
  'REPLY_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('missing required reply ID'),
  'REPLY_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('provided reply ID is invalid'),
};

module.exports = DomainErrorTranslator;
