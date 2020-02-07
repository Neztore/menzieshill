import React, {FunctionComponent, useEffect, useState} from "react";
import {Group} from "../../../shared/Types";
import {Api} from '../../../shared/util'

interface GroupDropdownProps {
    updateGroups: Function,
    currentGroups: Group[]
}


export const GroupDropdown: FunctionComponent<GroupDropdownProps> = function (props) {

    const [groups, setGroups] = useState<Array<Group>>([]);
    const [selectedValue, setSelected] = useState<string>();
    
    useEffect(function () {
        async function getAllGroups() {
            const apiGroups = await Api.get("/groups");
            if (apiGroups && !apiGroups.error) {

                setGroups(apiGroups)

            }
        }
        getAllGroups()
    }, [props.currentGroups]);
    
    async function addGroup() {
        let val: string = typeof selectedValue !== "string" ? getValidGroups(groups, props.currentGroups)[0].name : selectedValue;
        let grp:Group | undefined;
        for (let g of groups) {
            if (g.name.toLowerCase() === val.toLowerCase()) {
                grp = g;
                break;
            }
        }
        if (grp) {
            // do request
            const newArr = Array.from(props.currentGroups)
            newArr.push(grp);
            let success = await props.updateGroups(newArr)
            if (success) {

            }
        } else {
            throw new Error("Failed to find group: This shouldn't happen.")
        }
    }

    return <div className="field is-grouped">
        <div className="select control">
            <select value={selectedValue} onChange={(e=>setSelected(e.target.value))}>
                {
                    getValidGroups(groups, props.currentGroups).map((grp)=>{
                    return <option className = "tag  " key={grp.id}>{grp.name}</option>})
                }
            </select>
        </div>
        <button type="button" className="button is-success" onClick={addGroup}>Add group</button>
    </div>
};
export default GroupDropdown

function getValidGroups(allGroups: Group[], currentGroups: Group[]): Group[] {
    let validGroups = [];
    for (let g of allGroups) {
        let found = false;
        for (let current of currentGroups) {
            if (current.id === g.id) {
                found = true;
                break;
            }
        }
        if (!found) {
            validGroups.push(g)
        }
    }
    return validGroups
}