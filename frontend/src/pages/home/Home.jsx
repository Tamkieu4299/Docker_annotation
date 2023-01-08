import React from "react";
import Topbar from "../../components/topbar/Topbar";
import Feed from "../../components/feed/Feed";
import Boundingbox from "../../components/boundingbox/Boundingbox";
import { useState, useEffect, useRef, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import "./home.css";

export default function Home() {
    const { user } = useContext(AuthContext);

    return (
        <>
            <Topbar />
            <div className="homeContainer">
                <Feed username={user.email}/>
            </div>
        </>
    );
    

}