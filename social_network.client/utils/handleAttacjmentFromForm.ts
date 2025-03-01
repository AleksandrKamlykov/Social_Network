import { AttachmentType, IAttachment } from "../src/Widgets/attacments/types";

export const handleAttachment = async (values: { attachment: { originFileObj: File, name: string, type: string }[], description?: string }, attType: AttachmentType): Promise<Omit<IAttachment, "id" | "createdAt">> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(values.attachment[0].originFileObj);

        reader.onload = () => {
            const base64Data = reader.result as string;
            const payload: Omit<IAttachment, "id" | "createdAt"> = {
                base64Data: base64Data,
                type: attType,
                name: values.attachment[0].name,
                extension: values.attachment[0].type,
                description: values.description ?? 'Profile picture',
            };
            resolve(payload);
        };

        reader.onerror = (error) => {
            reject(error);
        };
    });
};