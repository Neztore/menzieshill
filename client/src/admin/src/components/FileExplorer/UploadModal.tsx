import React, {FunctionComponent} from "react";

interface UploadModalProps {
  info: string,
  handleCancel: Function
}

export const UploadModal: FunctionComponent<UploadModalProps> = ({info, handleCancel }) => {
  return (<div className="modal is-active">
    <div className="modal-background"/>
    <div className="modal-content">
      <div className="box has-text-centered">
        <p className="has-text-centered">Uploading {info}</p>
        <progress className="progress is-large is-info" max="100"/>
        <button className="button is-danger" onClick={()=>handleCancel()}>Cancel</button>
      </div>
    </div>
  </div>);
};
export default UploadModal;
