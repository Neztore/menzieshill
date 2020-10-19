import React from "react";

export function Home () {
  return (
    <div>
      <h1 className="title is-3">Home</h1>
      <p>This is the management homepage. Use the bar on the left to adjust various settings.</p>
      <p>If you are a normal user of this site, you may have been sent here after logging in or creating an account.
        <a href="/"> Click here</a> to return to the main site.
      </p>
      <p>If you can see this message, you are a member. You can access member-only files and more.</p>
    </div>
  );
}
export default Home;
