import React, {FunctionComponent} from "react";
import {Group} from "../../../shared/Types";


interface GroupBoxProps {
    updateGroups: Function,
    currentGroups: Group[]
}

const BoxStyle = {
    border: "1px solid rgb(219, 219, 219)",
    borderRadius: "3px",
    padding: "2px 2px 2px 0.3em",
    minHeight: "12vh"
};
export const GroupBox: FunctionComponent<GroupBoxProps> = function (props) {
    function removeGroup(group: Group) {
        let loc: number = -1;
        for (let counter = 0; counter < props.currentGroups.length; counter++) {
            if (props.currentGroups[counter].id=== group.id) {
                loc = counter;
                break;
            }
        }
        if (loc === -1) {
            // Oops?
            console.error(`Failed to find group: This shouldn't happen.`)
        } else {
            const newGroups = Array.from(props.currentGroups)
            newGroups.splice(loc, 1);
            props.updateGroups(newGroups)
        }
    }

    return <div className="field is-grouped is-grouped-multiline"
                style={BoxStyle}>

            {
                props.currentGroups.map((grp)=>
                    <div className="control"  key={grp.id}>
                        <div className="tags has-addons">
                            <span className="tag is-primary">
                                {grp.name}
                            </span>
                            <a className="tag is-delete" onClick={()=>removeGroup(grp)}/>
                        </div>

                    </div>)
            }
    </div>
};
export default GroupBox