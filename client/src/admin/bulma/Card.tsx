// Created by josh on 14/02/2020
import React, { FunctionComponent } from "react";

interface CardProps {
    title?: string,
    titleIcon?: FunctionComponent
}

export const Card: FunctionComponent<CardProps> = props => (
  <div className="card">
    {
            props.title
              ? (
                <div className="card-header">
                  {props.titleIcon
                    ? <div className="card-header-icon">props.titleIcon </div> : ""}
                  <div className="card-header-title">{props.title}</div>

                </div>
              )
              : ""
        }

    {props.children}
  </div>
);
export default Card;
