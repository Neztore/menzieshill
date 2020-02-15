// Created by josh on 14/02/2020
// This component does FAR too much. Oops.

import React, {FunctionComponent, useEffect, useState} from "react";
import {HttpError, Post} from "../../shared/Types";
import {Api} from "../../shared/util";
import Message from "../../../bulma/Message";
import PostForm from "./PostForm";

interface PostModalProps {
    postId?: number, // If defined, existing post edit. Else it's a new post !
    handleDone: Function // Is either passed the new post, or false.
}

export const PostModal: FunctionComponent<PostModalProps> = (props) => {
    const [post, setPostInfo] = useState<Partial<Post>>({
        title: "",
        content: ""
    });
    const [error, setError] = useState<HttpError["error"]>();
/*
    Cases:
     postId: Undefined (Create)
     postId: Defined.
        Fetch post (Show loading)
        Display post.
 */

    useEffect(()=> {
        async function getPost() {
            const postInfo = await Api.get(`/posts/${props.postId}`)
            if (postInfo.error) {
                setError(postInfo.error)
            } else {
                setPostInfo(postInfo.post)
            }
        }
        if (props.postId) {
            getPost();
        }

        return undefined
    }, [props.postId]);

    if (error) {
        return <Message title={`${error.status}: Oops. Failed to get post.`} text={error.message} colour="danger"/>
    }
    // A post to be loaded has been supplied, but it isn't loaded yet.
    if (post.id === undefined && props.postId) {
        return <div className="modal is-active">
            <div className="modal-background"/>
            <div className="modal-content">
                <div className="box">
                    <h2 className="subtitle" >Loading post - <a className="is-size-6" onClick={()=>props.handleDone(false)}>Cancel</a></h2>
                    <progress className="progress is-small is-primary" max="100">15%</progress>

                </div>

            </div>
        </div>
    } else {
        // The form itself. Handles submission, validation and all that jazz.
        return <PostForm post={post} handleDone={props.handleDone}/>
    }

};
export default PostModal