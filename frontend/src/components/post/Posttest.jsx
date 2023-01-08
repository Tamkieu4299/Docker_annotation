import "./post.css";
import { MoreVert } from "@material-ui/icons";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Canvasinit from "../canvasinit/Canvasinit";

export default function Posttest({ post }) {
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
                <div className="postCenter" id="viewport">
                    {/* <span className="postText">{post.user_id === currentUser.id ? post.annotation_path : null}</span> */}
                    {/* <img src={PF + post.image_path} alt="" className="postImg" /> */}
                    <Canvasinit post = {post} image_path={post.image_path} />
                </div>
            </div>
        </div>
    );
}