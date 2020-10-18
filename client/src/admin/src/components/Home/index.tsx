import React from "react";

export function Home () {
  return (
    <div>
      <h1 className="title is-3">Home</h1>
      <p>This is the management homepage. Use the bar on the left to adjust various settings.</p>
      <p>If you are a normal user if this site, you may have been sent here after logging in or creating an account.
        <a href="/">click here</a> to return to the main site.
      </p>
      <p>If you can see these message, you are a member. You can access member-only files and more.</p>
    </div>
  );
}
export default Home;
