// import React, { useEffect, useState } from "react";
// import { useData, useUpdateData } from "./api";
import { Lexical } from "./Lexical"
import Heading from "./components/Headings";
import "./css/Wordsmith.css"

export default function Wordsmith() {
  return (
    <div id="wordsmith">
      <Heading level={0} text="Wordsmith." textAlign="left"/>
      <Heading level={7} text="A bare-bones, browser-based rich text editor." textAlign="left"/>

      <Lexical />
    </div>
  );
}