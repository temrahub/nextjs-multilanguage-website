import React from "react";
import { sbEditable } from "@storyblok/storyblok-editable";

const Teaser = ({ blok }) => {
  return (
    <div {...sbEditable(blok)} key={blok._uid} className="bg-gray-300-half">
      <div className="pb-6 pt-28 container mx-auto ">
        <h2 className="text-center text-6xl font-bold font-serif text-primary mb-4">
          {blok.headline}
        </h2>
        <img
          src={blok?.image?.filename}
          alt={blok?.image?.alt}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default Teaser;
