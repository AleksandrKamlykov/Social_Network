import { FC, PropsWithChildren, useEffect, useState } from "react";
import { IUser } from "../types";
import { useRequest } from "@/Shared/api/useRequest";
import { AttachmentType } from "@/Widgets/attacments/types";
import { Avatar, Image, Spin } from "antd";

type Props = PropsWithChildren<{
    user: IUser;
}>;

export const UserListItem: FC<Props> = ({ user, children }) => {

    const [avatarBase64, setAvatarBase64] = useState<string | null>(null);

    const { get, loading } = useRequest<AttachmentType>();

    useEffect(() => {
        if (user.avatarId) {
            get(`attachments/${user.avatarId}`)
                .then(data => setAvatarBase64(data.data.base64Data));
        }
    }
        , [user]);

    return (<div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 50, height: 50 }}>
            {avatarBase64 ?
                <img src={avatarBase64} alt="avatar" style={{ width: 50, height: 50, borderRadius: 6 }} />
                : loading ?
                    <Spin /> :
                    <Avatar size={48}  >{user.name[0].toUpperCase()}</Avatar>}
        </div>
        <span>
            {user.name}
        </span>
        {children}
    </div>);
};