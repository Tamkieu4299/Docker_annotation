import "./post.css";
import { MoreVert } from "@material-ui/icons";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function Post({ post }) {
    const [user, setUser] = useState([]);
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const { user: currentUser } = useContext(AuthContext);
    
    useEffect(() => {
        const fetchUser = async () => {
            const res = await axios.get(`/users/find/id/${post.user_id}`);
            setUser(res.data);
        };
        fetchUser();
    }, [post.user_id]);

    // const likeHandler = () => {
    //     try {
    //         axios.put("/posts/" + post._id + "/like", {
    //             userId: currentUser._id,
    //         });
    //     } catch (err) {}
    //     setLike(isLiked ? like - 1 : like + 1);
    //     setIsLiked(!isLiked);
    // };
    return (
        <div className="post">
            <div className="postWrapper">
                <div className="postTop">
                    <div className="postTopLeft">
                        <img
                            src={PF + "noAvatar.png"}
                            alt=""
                            className="postProfileImg"
                        />
                        <span className="postUsername">{user.email}</span>
                    </div>
                    <div className="postTopRight">
                        <MoreVert />
                    </div>
                </div>
                <div className="postCenter">
                    <span className="postText">{post.user_id === currentUser.id ? post.annotation_path : null}</span>
                    <img src={PF + post.image_path} alt="" className="postImg" />
                </div>
                {/* <div className="postBottom">
                    <div className="postBottomLeft">
                        <img
                            src={`${PF}like.png`}
                            alt=""
                            className="likeIcon"
                            onClick={likeHandler}
                        />
                        <img
                            src={`${PF}heart.png`}
                            alt=""
                            className="likeIcon"
                            onClick={likeHandler}
                        />
                        <span className="postLikeCounter">{like}</span>
                    </div>
                    <div className="postBottomRight">
                        <span className="postCommentText">
                            {post.comment} comments
                        </span>
                    </div>
                </div> */}
            </div>
        </div>
    );
}