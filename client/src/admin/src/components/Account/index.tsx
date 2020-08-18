import React, { useEffect, useState } from "react";

import * as Api from "../../../../../public/js/apiFetch";
import { User } from "../../shared/Types";
import AccountForm from "./AccountForm";

export function AccountPage () {
  function editMade (newUsr: User) {
    console.log(`Edit made `, newUsr);
  }
  const [info, setInfo] = useState<any>();

  useEffect(() => {
    (async function () {
      if (!info) {
        const userInfo:User = await Api.get("/users/@me");
        setInfo(userInfo);
      }
    }());
  }, []);
  if (info) {
    return (
      <div className="admin-canscroll">
        <h1 className="title is-3">My account</h1>
        <div className="columns is-centered">
          <div className="column is-10">
            <div className="box">
              <AccountForm editMade={editMade} user={info} />
            </div>

          </div>
        </div>

      </div>
    );
  }
  return <p>Loading...</p>;
}
export default AccountPage;
