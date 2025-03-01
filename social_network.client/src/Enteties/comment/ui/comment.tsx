import {Avatar, Card, Typography} from "antd";
import { Comment } from "../types";
import dayjs from "dayjs";
import {NavLink} from "react-router-dom";
import {pathRouterBuilder} from "@/Shared/utils/pathRouterBuilder.ts";
import {pathes} from "@/App/router/pathes.ts";

interface CommentItemProps {
    comment: Comment;
}

export const CommentItem: React.FC<CommentItemProps> = ({comment}) => {
    return (
        <Card className="comment-item" style={{marginBottom:12}}  title={
            <div style={{display:"flex", alignItems:"center", gap:12, width:"fit-content"}}>
            <NavLink to={pathRouterBuilder(pathes.profile.absolute,{nickname:comment.userName})} >
                <Avatar src={comment.userAvatar} />
            </NavLink>
            <Typography style={{fontSize:"1rem", fontWeight:500}}>{comment.userName}</Typography>
        </div>}>

            <Typography style={{fontSize:"0.9rem", paddingLeft:20}}>{comment.content}</Typography>
            <Typography style={{textAlign:"right", fontSize:"0.7rem"}}>
                <span className="comment-date">{ dayjs(comment.date).format("DD.MM.YYYY HH:mm:ss")}</span>
            </Typography>
        </Card>
    );
    
}