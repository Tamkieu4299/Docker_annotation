import "./feed.css";
import Share from "../share/Share";
import Post from "../post/Post";
import Posttest from "../post/Posttest";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

export default function Feed({ username }) {
    const [posts, setPosts] = useState([]);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchPosts = async () => {
            const res = await axios.get("/posts/find/all")
            setPosts(res.data.sort((p1, p2) => {
                return new Date(p2.id) - new Date(p1.id);
            }))
        };
        fetchPosts();
    }, [username, user._id]);

    return (
        <div className="feed">
            <div className="feedWrapper">
                {/* {(!username || username === user.username) && <Share />} */}
                <Share />
                {posts.map((p) => (
                    // <Post key={p.id} post={p} />
                    <Posttest key={p.id} post={p} />
                ))}
            </div>
        </div>
    );
}