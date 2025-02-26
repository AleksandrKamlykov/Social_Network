export type AttachmentType = "image" | "video" | "document"; // Example values, adjust as needed

export type IAttachment = {
  id: string;
  type: AttachmentType;
  name: string;
  description?: string;
  extension: string;
  base64Data: string;
  createdAt: string;
};
