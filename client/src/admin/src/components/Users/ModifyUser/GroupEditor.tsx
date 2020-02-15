import React, {FunctionComponent, useState} from "react";
import { GroupDropdown } from "./GroupDropdown";
import { GroupBox} from "./GroupBox";
import {Group} from "../../../shared/Types";
import { Api } from "../../../shared/util"

// A Formik component
interface GroupBoxProps {
    groups: Group[],
    userId: number
}


export const GroupEditor: FunctionComponent<GroupBoxProps> = function (props) {
    const [groups, setGroups] = useState<Group[]>(props.groups);

    async function updateGroups(nGroups: Group[] ):Promise<boolean> {
        let ids: number[] = [];
        for (let grp of nGroups) {
            ids.push(grp.id)
        }
        const res = await Api.patch(`/users/${props.userId}/groups`, {
            body: {groups: ids}
        });
        if (res.error) {
            // oops
            console.error(`Failed to update groups: ${res.error.status}: ${res.error.message}.`)
        } else {
            setGroups(nGroups);
            return true
        }
        return false
    }

    return <div>
        <label className="label">User groups</label>
        <p className="help">Modify user's groups. Groups grant specific permissions - for example manage files.</p>
        <GroupDropdown currentGroups={groups} updateGroups={updateGroups}/>
        <GroupBox currentGroups={groups} updateGroups={updateGroups}/>


    </div>
};
export default GroupEditor