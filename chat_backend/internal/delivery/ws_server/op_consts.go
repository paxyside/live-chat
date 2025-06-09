package ws_server

const (
	OpInvalidData = "invalid_data"

	OpAuth        = "auth"
	OpAuthSuccess = "auth_success"
	OpAuthError   = "auth_error"

	OpAllChats        = "all_chats"
	OpAllChatsSuccess = "all_chats_success"
	OpAllChatsError   = "all_chats_error"

	OpChatOpen        = "chat_open"
	OpChatOpenSuccess = "chat_open_success"
	OpChatOpenError   = "chat_open_error"

	OpMessageSend      = "message_send"
	OpMessageSendError = "message_send_error"
	OpMessageNew       = "message_new"

	OpMessageRead        = "message_read"
	OpMessageReadSuccess = "message_read_success"
	OpMessageReadError   = "message_read_error"

	OpMessageEdit        = "message_edit"
	OpMessageEditSuccess = "message_edit_success"
	OpMessageEditError   = "message_edit_error"

	OpMessageDelete        = "message_delete"
	OpMessageDeleteSuccess = "message_delete_success"
	OpMessageDeleteError   = "message_delete_error"

	OpMessageTyping        = "message_typing"
	OpMessageTypingSuccess = "message_typing_success"
	OpMessageTypingError   = "message_typing_error"

	OpUnknownOp = "unknown_op"
)
