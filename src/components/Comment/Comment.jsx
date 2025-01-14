import React, { forwardRef } from "react";

// import { GrDrag } from "react-icons/gr";
import moment from "moment";
const Comment = forwardRef(
  ({ comment, date, id, dragHandleProps, snapshot, ...props }, ref) => {
    return (
      <li
        ref={ref}
        {...props}
        className={
          "comment card p-2 my-2 " + (snapshot.isDragging ? "hovering" : "")
        }
      >
        <div className="d-flex align-items-top">
          <span {...dragHandleProps}>
            {/* <GrDrag /> */}
          </span>
          <small className="ml-2 text-dark">{comment}</small>
        </div>
        <div className="text-muted text-right">
          <small>{moment(date).format("DD/mm/yyyy")}</small>
        </div>
      </li>
    );
  }
);

export default Comment;
