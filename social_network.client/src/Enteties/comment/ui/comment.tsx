import { Card } from "antd";
import { Comment } from "../types";
import dayjs from "dayjs";

interface CommentItemProps {
    comment: Comment;
}

export const CommentItem: React.FC<CommentItemProps> = ({comment}) => {
    return (
        <Card className="comment-item" >
            <p className="comment-content">{comment.content}</p>
            <div className="comment-footer">
                <span className="comment-date">{ dayjs(comment.date).format("DD.MM.YYYY HH:mm:ss")}</span>
            </div>
        </Card>
    );
    
}