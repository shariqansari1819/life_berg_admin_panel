import React, { forwardRef } from "react";

const Comments = forwardRef(({ children, ...props }, ref) => {
  return (
    <ul ref={ref} className="comments">
      {children}
    </ul>
  );
});

export default Comments;
