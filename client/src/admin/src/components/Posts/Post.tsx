// Created by josh on 14/02/2020
import React, {FunctionComponent, useState} from "react";
import {Post} from "../../shared/Types";
import Card from "../../../bulma/Card";
import { Redirect } from 'react-router-dom'
import {unescape} from "../../shared/util";

interface PostProps {
    post: Post,
    openPost: Function
}
// TODO: SO I REMEMBER.
// Make it so this returns a Redirect when you open post.
// to /posts/:id. This means a open function doesn't have to be passed everywhere and it's nice & neat.

export const PostBox: FunctionComponent<PostProps> = ({post, openPost}) => {
    const {
        title,
        content,
        author,
        id
    } = post;
    const displayContent = unescape(content.length > 150 ? content.substr(0, 150) + "..." : content);


    return <div className="column is-one-quarter">
        <Card title={title}>
            <div className="card-content">
                <div className="content word-break"><p className="is-size-6">{displayContent}</p></div>
            </div>

            <div className="card-footer">
                <p className="card-footer-item text-special-overflow">{author.username}</p>
                <a className="card-footer-item text-special-overflow" onClick={()=>openPost(id)}>Edit</a>
            </div>
        </Card>
    </div>
};
export default PostBox