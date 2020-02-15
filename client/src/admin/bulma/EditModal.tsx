import React, {FunctionComponent} from "react";




interface EditModalProps {
    close: Function,
    save: Function,
    title: string,
    isSubmitting?: boolean

}


export const EditModal:FunctionComponent<EditModalProps> = (props) => {

    return <div className="modal is-active">
        <div className="modal-background"/>
        <div className="modal-card">
            <header className="modal-card-head">
                <p className="modal-card-title">{props.title}</p>
                <button onClick={() => props.close()} className="delete" aria-label="close"/>
            </header>
            <section className="modal-card-body">
                {props.children}
            </section>
            <footer className="modal-card-foot">
                <button type="button" onClick={()=>props.save()} className="button is-success" disabled={props.isSubmitting}>Save changes</button>
                <button type="button" className="button" onClick={()=> props.close()}>Cancel</button>
            </footer>
        </div>
    </div>


}
export default EditModal