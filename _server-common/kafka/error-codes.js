// https://kafka.apache.org/protocol.html#protocol_error_codes
const { groupBy, mapValues, find } = require("lodash");

const SUCCESS = {
  type: "NONE",
  code: 0,
  retriable: true,
  description: "It worked. Good for you!"
};

const UNKNOWN_ERROR = {
  type: "UNKNOWN",
  code: -1,
  retriable: false,
  description:
    "The server experienced an unexpected error when processing the request"
};

const errorCodes = [
  SUCCESS,
  {
    type: "OFFSET_OUT_OF_RANGE",
    code: 1,
    retriable: false,
    description:
      "The requested offset is not within the range of offsets maintained by the server"
  },
  {
    type: "CORRUPT_MESSAGE",
    code: 2,
    retriable: true,
    description:
      "This message has failed its CRC checksum, exceeds the valid size, or is otherwise corrupt"
  },
  {
    type: "UNKNOWN_TOPIC_OR_PARTITION",
    code: 3,
    retriable: true,
    description: "This server does not host this topic-partition"
  },
  {
    type: "INVALID_FETCH_SIZE",
    code: 4,
    retriable: false,
    description: "The requested fetch size is invalid"
  },
  {
    type: "LEADER_NOT_AVAILABLE",
    code: 5,
    retriable: true,
    description:
      "There is no leader for this topic-partition as we are in the middle of a leadership election"
  },
  {
    type: "NOT_LEADER_FOR_PARTITION",
    code: 6,
    retriable: true,
    description: "This server is not the leader for that topic-partition"
  },
  {
    type: "REQUEST_TIMED_OUT",
    code: 7,
    retriable: true,
    description: "The request timed out"
  },
  {
    type: "BROKER_NOT_AVAILABLE",
    code: 8,
    retriable: false,
    description: "The broker is not available"
  },
  {
    type: "REPLICA_NOT_AVAILABLE",
    code: 9,
    retriable: false,
    description:
      "The replica is not available for the requested topic-partition"
  },
  {
    type: "MESSAGE_TOO_LARGE",
    code: 10,
    retriable: false,
    description:
      "The request included a message larger than the max message size the server will accept"
  },
  {
    type: "STALE_CONTROLLER_EPOCH",
    code: 11,
    retriable: false,
    description: "The controller moved to another broker"
  },
  {
    type: "OFFSET_METADATA_TOO_LARGE",
    code: 12,
    retriable: false,
    description: "The metadata field of the offset request was too large"
  },
  {
    type: "NETWORK_EXCEPTION",
    code: 13,
    retriable: true,
    description: "The server disconnected before a response was received"
  },
  {
    type: "GROUP_LOAD_IN_PROGRESS",
    code: 14,
    retriable: true,
    description:
      "The coordinator is loading and hence can't process requests for this group"
  },
  {
    type: "GROUP_COORDINATOR_NOT_AVAILABLE",
    code: 15,
    retriable: true,
    description: "The group coordinator is not available"
  },
  {
    type: "NOT_COORDINATOR_FOR_GROUP",
    code: 16,
    retriable: true,
    description: "This is not the correct coordinator for this group"
  },
  {
    type: "INVALID_TOPIC_EXCEPTION",
    code: 17,
    retriable: false,
    description:
      "The request attempted to perform an operation on an invalid topic"
  },
  {
    type: "RECORD_LIST_TOO_LARGE",
    code: 18,
    retriable: false,
    description:
      "The request included message batch larger than the configured segment size on the server"
  },
  {
    type: "NOT_ENOUGH_REPLICAS",
    code: 19,
    retriable: true,
    description:
      "Messages are rejected since there are fewer in-sync replicas than required"
  },
  {
    type: "NOT_ENOUGH_REPLICAS_AFTER_APPEND",
    code: 20,
    retriable: true,
    description:
      "Messages are written to the log, but to fewer in-sync replicas than required"
  },
  {
    type: "INVALID_REQUIRED_ACKS",
    code: 21,
    retriable: false,
    description: "Produce request specified an invalid value for required acks"
  },
  {
    type: "ILLEGAL_GENERATION",
    code: 22,
    retriable: false,
    description: "Specified group generation id is not valid"
  },
  {
    type: "INCONSISTENT_GROUP_PROTOCOL",
    code: 23,
    retriable: false,
    description:
      "The group member's supported protocols are incompatible with those of existing members"
  },
  {
    type: "INVALID_GROUP_ID",
    code: 24,
    retriable: false,
    description: "The configured groupId is invalid"
  },
  {
    type: "UNKNOWN_MEMBER_ID",
    code: 25,
    retriable: false,
    description: "The coordinator is not aware of this member"
  },
  {
    type: "INVALID_SESSION_TIMEOUT",
    code: 26,
    retriable: false,
    description:
      "The session timeout is not within the range allowed by the broker (as configured by group.min.session.timeout.ms and group.max.session.timeout.ms)"
  },
  {
    type: "REBALANCE_IN_PROGRESS",
    code: 27,
    retriable: false,
    description: "The group is rebalancing, so a rejoin is needed"
  },
  {
    type: "INVALID_COMMIT_OFFSET_SIZE",
    code: 28,
    retriable: false,
    description: "The committing offset data size is not valid"
  },
  {
    type: "TOPIC_AUTHORIZATION_FAILED",
    code: 29,
    retriable: false,
    description: "Not authorized to access topics: [Topic authorization failed]"
  },
  {
    type: "GROUP_AUTHORIZATION_FAILED",
    code: 30,
    retriable: false,
    description: "Not authorized to access group: Group authorization failed"
  },
  {
    type: "CLUSTER_AUTHORIZATION_FAILED",
    code: 31,
    retriable: false,
    description: "Cluster authorization failed"
  },
  {
    type: "INVALID_TIMESTAMP",
    code: 32,
    retriable: false,
    description: "The timestamp of the message is out of acceptable range"
  },
  {
    type: "UNSUPPORTED_SASL_MECHANISM",
    code: 33,
    retriable: false,
    description: "The broker does not support the requested SASL mechanism"
  },
  {
    type: "ILLEGAL_SASL_STATE",
    code: 34,
    retriable: false,
    description: "Request is not valid given the current SASL state"
  },
  {
    type: "UNSUPPORTED_VERSION",
    code: 35,
    retriable: false,
    description: "The version of API is not supported"
  },
  {
    type: "TOPIC_ALREADY_EXISTS",
    code: 36,
    retriable: false,
    description: "Topic with this name already exists"
  },
  {
    type: "INVALID_PARTITIONS",
    code: 37,
    retriable: false,
    description: "Number of partitions is invalid"
  },
  {
    type: "INVALID_REPLICATION_FACTOR",
    code: 38,
    retriable: false,
    description: "Replication-factor is invalid"
  },
  {
    type: "INVALID_REPLICA_ASSIGNMENT",
    code: 39,
    retriable: false,
    description: "Replica assignment is invalid"
  },
  {
    type: "INVALID_CONFIG",
    code: 40,
    retriable: false,
    description: "Configuration is invalid"
  },
  {
    type: "NOT_CONTROLLER",
    code: 41,
    retriable: true,
    description: "This is not the correct controller for this cluster"
  },
  {
    type: "INVALID_REQUEST",
    code: 42,
    retriable: false,
    description:
      "This most likely occurs because of a request being malformed by the client library or the message was sen't to an incompatible broker. See the broker logs for more details"
  },
  {
    type: "UNSUPPORTED_FOR_MESSAGE_FORMAT",
    code: 43,
    retriable: false,
    description:
      "The message format version on the broker does not support the request"
  },
  {
    type: "POLICY_VIOLATION",
    code: 44,
    retriable: false,
    description: "Request parameters do not satisfy the configured policy"
  },
  {
    type: "OUT_OF_ORDER_SEQUENCE_NUMBER",
    code: 45,
    retriable: false,
    description: "The broker received an out of order sequence number"
  },
  {
    type: "DUPLICATE_SEQUENCE_NUMBER",
    code: 46,
    retriable: false,
    description: "The broker received a duplicate sequence number"
  },
  {
    type: "INVALID_PRODUCER_EPOCH",
    code: 47,
    retriable: false,
    description:
      "Producer attempted an operation with an old epoch. Either there is a newer producer with the same transactionalId, or the producer's transaction has been expired by the broker"
  },
  {
    type: "INVALID_TXN_STATE",
    code: 48,
    retriable: false,
    description:
      "The producer attempted a transactional operation in an invalid state"
  },
  {
    type: "INVALID_PRODUCER_ID_MAPPING",
    code: 49,
    retriable: false,
    description:
      "The producer attempted to use a producer id which is not currently assigned to its transactional id"
  },
  {
    type: "INVALID_TRANSACTION_TIMEOUT",
    code: 50,
    retriable: false,
    description:
      "The transaction timeout is larger than the maximum value allowed by the broker (as configured by max.transaction.timeout.ms)"
  },
  {
    type: "CONCURRENT_TRANSACTIONS",
    code: 51,
    retriable: false,
    description:
      "The producer attempted to update a transaction while another concurrent operation on the same transaction was ongoing"
  },
  {
    type: "TRANSACTION_COORDINATOR_FENCED",
    code: 52,
    retriable: false,
    description:
      "Indicates that the transaction coordinator sending a WriteTxnMarker is no longer the current coordinator for a given producer"
  },
  {
    type: "TRANSACTIONAL_ID_AUTHORIZATION_FAILED",
    code: 53,
    retriable: false,
    description: "Transactional Id authorization failed"
  },
  {
    type: "SECURITY_DISABLED",
    code: 54,
    retriable: false,
    description: "Security features are disabled"
  },
  {
    type: "OPERATION_NOT_ATTEMPTED",
    code: 55,
    retriable: false,
    description:
      "The broker did not attempt to execute this operation. This may happen for batched RPCs where some operations in the batch failed, causing the broker to respond without trying the rest"
  },
  {
    type: "KAFKA_STORAGE_ERROR",
    code: 56,
    retriable: true,
    description: "Disk error when trying to access log file on the disk"
  },
  {
    type: "LOG_DIR_NOT_FOUND",
    code: 57,
    retriable: false,
    description:
      "The user-specified log directory is not found in the broker config"
  },
  {
    type: "SASL_AUTHENTICATION_FAILED",
    code: 58,
    retriable: false,
    description: "False	SASL Authentication failed"
  },
  {
    type: "UNKNOWN_PRODUCER_ID",
    code: 59,
    retriable: false,
    description:
      "This exception is raised by the broker if it could not locate the producer metadata associated with the producerId in question. This could happen if, for instance, the producer's records were deleted because their retention time had elapsed. Once the last records of the producerId are removed, the producer's metadata is removed from the broker, and future appends by the producer will return this exception"
  },
  {
    type: "REASSIGNMENT_IN_PROGRESS",
    code: 60,
    retriable: false,
    description: "A partition reassignment is in progress"
  },
  {
    type: "DELEGATION_TOKEN_AUTH_DISABLED",
    code: 61,
    retriable: false,
    description: "Delegation Token feature is not enabled"
  },
  {
    type: "DELEGATION_TOKEN_NOT_FOUND",
    code: 62,
    retriable: false,
    description: "Delegation Token is not found on server"
  },
  {
    type: "DELEGATION_TOKEN_OWNER_MISMATCH",
    code: 63,
    retriable: false,
    description: "Specified Principal is not valid Owner/Renewer"
  },
  {
    type: "DELEGATION_TOKEN_REQUEST_NOT_ALLOWED",
    code: 64,
    retriable: false,
    description:
      "Delegation Token requests are not allowed on PLAINTEXT/1-way SSL channels and on delegation token authenticated channels"
  },
  {
    type: "DELEGATION_TOKEN_AUTHORIZATION_FAILED",
    code: 65,
    retriable: false,
    description: "Delegation Token authorization failed"
  },
  {
    type: "DELEGATION_TOKEN_EXPIRED",
    code: 66,
    retriable: false,
    description: "Delegation Token is expired"
  },
  {
    type: "INVALID_PRINCIPAL_TYPE",
    code: 67,
    retriable: false,
    description: "Supplied principalType is not supported"
  },
  {
    type: "NON_EMPTY_GROUP",
    code: 68,
    retriable: false,
    description: "The group is not empty"
  },
  {
    type: "GROUP_ID_NOT_FOUND",
    code: 69,
    retriable: false,
    description: "The group id was not found"
  },
  {
    type: "FETCH_SESSION_ID_NOT_FOUND",
    code: 70,
    retriable: true,
    description: "The fetch session ID was not found"
  },
  {
    type: "INVALID_FETCH_SESSION_EPOCH",
    code: 71,
    retriable: true,
    description: "The fetch session epoch is invalid"
  },
  {
    type: "LISTENER_NOT_FOUND",
    code: 72,
    retriable: false,
    description:
      "There is no listener on the leader broker that matches the listener on which metadata request was processed."
  },
  {
    type: "TOPIC_DELETION_DISABLED",
    code: 73,
    retriable: true,
    description: "Topic deletion is disabled"
  },
  {
    type: "FENCED_LEADER_EPOCH",
    code: 74,
    retriable: true,
    description:
      "The leader epoch in the request is older than the epoch on the broker"
  },
  {
    type: "UNKNOWN_LEADER_EPOCH",
    code: 75,
    retriable: true,
    description:
      "The leader epoch in the request is newer than the epoch on the broker"
  },
  {
    type: "UNSUPPORTED_COMPRESSION_TYPE",
    code: 76,
    retriable: false,
    description:
      "The requesting client does not support the compression type of given partition"
  }
];

const unmatchedErrorCode = errorCode => ({
  type: "INVALID_ERROR_CODE",
  code: NaN,
  retriable: false,
  description:
    "The provided error code is either invalid or unknown by this system. " +
    `To get details on your error code (${errorCode}) review all kafka error codes ` +
    "at https://kafka.apache.org/protocol.html#protocol_error_codes"
});

const failure = code => code !== SUCCESS.code;
const identifyError = errorCode => {
  if (errorCode === UNKNOWN_ERROR.code) return UNKNOWN_ERROR;
  return errorCodes[errorCode] || unmatchedErrorCode(errorCode);
};

module.exports = {
  failure,
  identifyError
};
