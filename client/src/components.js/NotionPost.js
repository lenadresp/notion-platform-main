import React, { useState } from "react";
import { useParams } from "react-router-dom";

const NotionPost = ({ socket }) => {
    const { id } = useParams();
    const [comment, setComment] = useState("");
    const [post, setPost] = useState({});
    const [loading, setLoading] = useState(true);
   
    useEffect(() => {
        socket.on("postDetails", (data) => {
            setPost(data);
            setLoading(false);
        });
    }, [socket]);

    const handleAddComment = (e) => {
        e.preventDefault();
        socket.emit("newComment", {
            comment,
            user: localStroage.getItem("username"),
            postID: id,
        });
        setComment("");
    };

    if(loading){
        return <h2>Loading... Please wait</h2>
    }

    return (
        <div className='notionPost'>
            <div className='notionPost__container'>
                <h1>{post.title}</h1>
                <div className='notionPost__meta'>
                    <p className='notionPost__author'>By {post.author}</p>
                    <p className='notionPost__date'>Created on {post.createdAt}</p>
                </div>

                <div className='notionPost__content'>{post.content}</div>
            </div>

            <div className='comments__container'>
                <h2>Add Comments</h2>
                <form className='comments__inputContainer' onSubmit={handleAddComment}>
                    <textarea
                        placeholder='Type in your comments...'
                        rows={5}
                        className='comments__input'
                        value={comment}
                        required
                        onChange={(e) => setComment(e.target.value)}
                    />
                    <button className='comments__cta'>Add Comment</button>
                </form>

                <div>
                    {post.comments.map((item) => (
                        <p className='comment' key={item.id}>
                            <span style={{ fontWeight: "bold", marginRight: "15px"}}>
                                {item.user}
                                </span>
                                {item.message}
                        </p>
                    ))};
                </div>
            </div>
        </div>
    );
};

export default NotionPost;