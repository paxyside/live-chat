import React from "react";
import MessageImageAttachment from "./MessageImageAttachment";
import MessageVideoAttachment from "./MessageVideoAttachment";
import MessageAudioAttachment from "./MessageAudioAttachment";
import MessageFileAttachment from "./MessageFileAttachment";
import {FileTypes, getFileTypeByExtension} from "@/utils/getFileTypeByExt";

interface MessageAttachmentProps {
  file_url?: string;
  filename?: string;
}

const MessageAttachment: React.FC<MessageAttachmentProps> = ({file_url, filename}) => {
  if (!file_url) return null;

  switch (getFileTypeByExtension(file_url)) {
    case FileTypes.IMAGE:
      return <MessageImageAttachment file_url={file_url}/>;
    case FileTypes.VIDEO:
      return <MessageVideoAttachment file_url={file_url} filename={filename}/>;
    case FileTypes.AUDIO:
      return <MessageAudioAttachment file_url={file_url} filename={filename}/>;
    default:
      return <MessageFileAttachment file_url={file_url} filename={filename}/>;
  }
};

export default MessageAttachment;