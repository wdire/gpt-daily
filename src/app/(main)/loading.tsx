import {LoaderIcon} from "@/components/icons";
import React from "react";

const Loading = () => {
  return (
    <div className="fixed w-full h-full left-0 top-0 flex items-center justify-center">
      <div className="w-10 h-10 animate-spin">
        <LoaderIcon />
      </div>
    </div>
  );
};

export default Loading;
