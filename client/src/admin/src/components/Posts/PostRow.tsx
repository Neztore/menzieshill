// Created by josh on 14/02/2020
import React, {FunctionComponent} from "react";
import {Post} from "../../shared/Types";
import PostBox from "./Post";

interface PostRowProps {
    posts: Post[],
    openPost: Function
}

export const PostRow: FunctionComponent<PostRowProps> = (props) => {
    return <div className="columns is-desktop">
        {
            props.posts.map((post)=> <PostBox openPost={props.openPost} post={post} key={post.id}/>)
        }
    </div>
};
export default PostRow