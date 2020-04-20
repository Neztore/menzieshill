// Created by josh on 15/02/2020
// Keeps all the components down to a nice size.

import React, {FunctionComponent} from "react";
import {Form, Formik} from "formik";
import {Api, unescape} from "../../shared/util";
import {EditModal} from "../../../bulma/EditModal";
import {NormalInput, Field, TextArea} from "../../../bulma/Field";
import {Post} from "../../shared/Types";

interface PostFormProps {
    post: Partial<Post>,
    handleDone: Function
}

export const PostForm: FunctionComponent<PostFormProps> = ({post, handleDone}) => {
    let {
        title,
        content
    } = post;
    if (content) {
        content = unescape(content)
    }
    async function deletePost() {
        const confirmation = confirm("Are you sure you want to delete this post?");
        if (!confirmation) return;
        // Delete it
        if (post.id) {

            const resp = await Api.delete(`/posts/${post.id}`)
            if (resp.error) {
                alert(`Failed to delete: ${resp.error.message}`)
            }
        }
        handleDone(true)
    }

        return <Formik
            initialValues={{title, content}}
            onSubmit={async (values, { setSubmitting, setErrors }) => {
                const postRequest = post.id ? Api.patch(`/posts/${post.id}`, { body: values }) : Api.post(`/posts`, {body: values});
                const res = await postRequest;
                if (res.error) {
                    console.error(`${res.error.status}: ${res.error.message}`);
                    setErrors({
                        title: res.error.message
                    })
                    setSubmitting(false)
                } else {
                    handleDone(true)
                }
            }}
            validate={(values)=>{
                const errors:any = {};
                if (values.title) {
                    if (values.title.length > 50 || values.title.length < 3) {
                        errors.title = "Title must be less than 50 characters and more than 3."
                    }
                } else {
                    errors.title = "A title is required."
                }

                if (values.content) {
                    if (values.content.length > 10000) {
                        errors.content = "What. More than 10 thousand characters? In a post? Why? no."
                    } else if (values.content.length < 3) {
                        errors.content = "Content must be more than 3 characters."
                    }
                } else {
                    errors.content = "Content is required."
                }

                return errors

            }}
        >
            {({ isSubmitting, handleSubmit }) => (
                <EditModal delete={deletePost} close={()=>handleDone(false)} save={handleSubmit} isSubmitting={isSubmitting} title={post.id ? `Editing ${title}`: "New post"}>
                    <Form>
                        <Field>
                            <NormalInput type="text" name="title" label="Post title"/>
                        </Field>
                        <Field>
                            <TextArea name="content" label="Post contents" rows="15"/>
                        </Field>
                    </Form>
                </EditModal>
            )}
        </Formik>


};
export default PostForm