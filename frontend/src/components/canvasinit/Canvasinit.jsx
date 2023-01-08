import { useEffect, useState, useContext, useRef } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

export default function Canvasinit({ post, image_path }) {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const [drawing, setDrawing] = useState(false);
    const canvasRef = useRef(null);
    const [onEdit, setOnEdit] = useState(false);
    const ctxRef = useRef(null);
    const { user } = useContext(AuthContext);
    useEffect(() => {
        const c = document.getElementById(image_path);
        const ctx = c.getContext("2d");
        var imageObj1 = new Image();
        imageObj1.src = PF + image_path;
        imageObj1.onload = function () {
            ctx.drawImage(imageObj1, 0, 0);
            if (post.user_id === user.id && post.annotation_path !== "") {
                const anno_arr = post.annotation_path.split("/"); // "/279,84/153,97"
                for (const xy of anno_arr) {
                    const xy_arr = xy.split(",");
                    ctx.strokeRect(
                        parseInt(xy_arr[0]),
                        parseInt(xy_arr[1]),
                        60,
                        80
                    );
                }
            }
        };
    }, [image_path, PF]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.lineCap = "round";
        ctx.strokeStyle = "red";
        ctx.lineWidth = 10;
        ctxRef.current = ctx;
    }, [image_path]);

    const startDraw = ({ nativeEvent }) => {
        if (post.user_id !== user.id || !onEdit) return;
        const { offsetX, offsetY } = nativeEvent;
        ctxRef.current.beginPath();
        ctxRef.current.moveTo(offsetX, offsetY);
        setDrawing(true);
    };
    const stopDraw = async ({ nativeEvent }) => {
        if (post.user_id !== user.id || !onEdit) return;
        ctxRef.current.closePath();
        if (!drawing) return;
        const { offsetX, offsetY } = nativeEvent;
        ctxRef.current.strokeRect(offsetX, offsetY, 60, 80);
        const newXY = {
            x: offsetX.toString(),
            y: offsetY.toString(),
        };
        try {
            await axios.put(`/posts/update/${post.id}`, newXY);
        } catch (err) {}
        console.log(offsetX, offsetY);
        setDrawing(false);
    };
    const edit = () => {
        setOnEdit(!onEdit)
        // window.location.reload();
    };
    return (
        <div>
            <canvas
                ref={canvasRef}
                id={image_path}
                width="1000"
                height="300"
                // style={{ border: "1px solid #d3d3d3" }}
                onMouseDown={startDraw}
                onMouseUp={stopDraw}
            >
                Your browser does not support the HTML canvas tag.
            </canvas>
            <br />
            {post.user_id === user.id && (
                <button onClick={() => edit()}>{onEdit?"Save" :"Edit"}</button>
            )}
        </div>
    );
}
