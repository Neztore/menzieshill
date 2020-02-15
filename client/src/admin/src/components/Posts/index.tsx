import React, {useEffect, useState} from "react";
import { Api } from '../../shared/util'
import Message from "../../../bulma/Message";
import {HttpError, Post} from '../../shared/Types'
import { PostRow} from "./PostRow";
import { Route } from "react-router";
import PostModal from "./PostModal";
import {Redirect} from "react-router-dom";

export function Posts() {
    const [posts, setPosts] = useState<Array<Array<Post>>>([]);
    const [error, setError] = useState<HttpError["error"]>();
    const [redirect, setRedirect] = useState<string|boolean>(false)


    useEffect(function() {
        async function getPosts() {
            const apiResponse = await Api.get("/posts/list/");
            if (apiResponse.error) {
                setError(apiResponse.error)
            } else {
                const postList = apiResponse.posts;

                // Code from Stackoverflow - Splits array into arrays of 4 parts.
                let i,j,chunk = 4;
                const outList = [];
                for (i=0,j=postList.length; i<j; i+=chunk) {
                    outList.push(postList.slice(i,i+chunk))
                }
                setPosts(outList)
            }
        }
        if (posts.length === 0) {
            getPosts();
        }

    });
    function handleDone(refresh: boolean) {
        if (refresh) {
            setPosts([])
        }
        setRedirect("")
    }

    function openPost (id: string) {
        setRedirect(`${id}`)
    }

    useEffect(function () {
        if (redirect !== false) {
            setRedirect(false)
        }
        return undefined
    }, [redirect]);

    // For after post edit cleanup
    if (redirect !== false) {
        return <Redirect  to={`/admin/posts/${redirect}`}>></Redirect>
    }


    if (error) {
        return <div>
            <h1 className="title is-3">Posts</h1>
            <div className="columns">
                <div className="column is-4 is-offset-4">
                    <Message colour="danger" title={`${error.status}: Oops! Failed to get posts.`} text={error.message}/>
                </div>
            </div>

        </div>

    } else {
        // Woot. No errors - Render posts.
        return <div>
                <h1 className="title is-3">Posts <button onClick={()=>openPost("new")} className="button is-info is-outlined">Create</button></h1>
            <Route exact path="/admin/posts/:id">
                {({match})=>  match ? <PostModal handleDone={handleDone} postId={isNaN(match.params.id) ? undefined : match.params.id}/>: "" }
            </Route>

            {posts.map((postGroup)=> <PostRow openPost={openPost} key={Math.random()} posts={postGroup}/>)}
        </div>
    }

}
export  default Posts