import React, { FunctionComponent, useState } from "react";

import { Group } from "../../../shared/Types";
import { Api } from "../../../shared/util";
import { GroupBox } from "../../Users/ModifyUser/GroupBox";
import { GroupDropdown } from "../../Users/ModifyUser/GroupDropdown";

// A Formik component
interface GroupBoxProps {
  groups: Group[],
  updateUrl: string
}

export const AccessGroupEditor: FunctionComponent<GroupBoxProps> = function AccessGroupEditor ({ groups: initialGroups, updateUrl }) {
  const [groups, setGroups] = useState<Group[]>(initialGroups);

  async function updateGroups (nGroups: Group[]):Promise<boolean> {
    const ids: number[] = [];
    for (const grp of nGroups) {
      ids.push(grp.id);
    }
    const res = await Api.patch(updateUrl, { body: { accessGroups: ids } });
    if (res.error) {
      // oops
      console.error(`Failed to update groups: ${res.error.status}: ${res.error.message}.`);
    } else {
      setGroups(nGroups);
      return true;
    }
    return false;
  }

  return (
    <div>
      <label className="label">Access groups</label>
      <p className="help">Modify permission groups. Everyone in the groups listed can view this item and any children.</p>
      <GroupDropdown currentGroups={groups} updateGroups={updateGroups} />
      <GroupBox currentGroups={groups} updateGroups={updateGroups} />

    </div>
  );
};
export default AccessGroupEditor;
