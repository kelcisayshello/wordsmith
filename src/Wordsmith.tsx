// Lexical.js
import Lexical from "./Lexical"

// FontAwesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from "@fortawesome/free-brands-svg-icons";

export default function Wordsmith() {
  return (
    <>
      <div id="wordsmith">
        <h1 className="app-title-heading">Wordsmith.</h1>
        <p className="subtitle-heading">A bare-bones, browser-based text formatter great for drafting simple emails, taking quick notes with basic formatting, or cleaning up plain text before pasting it elsewhere.</p>
        <Lexical />
        <footer>Copyright © 2024 • Made by <a href="https://www.linkedin.com/in/kelcimensah/" target="_blank">Kelci Mensah</a>, hosted on <a href="https://github.com/kelcisayshello/wordsmith"><FontAwesomeIcon icon={faGithub} /></a>.</footer>
      </div>
      <div id="viewport-warning">
        <p>Hold on ✋🏾 <br/>Your viewport is too small and Wordsmith requires viewport space. Please rotate your device or use a larger screen.</p>
      </div>
    </>

  );
}