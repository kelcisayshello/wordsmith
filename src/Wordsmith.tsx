import Lexical from "./Lexical"
import Heading from "./components/Headings";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import "./css/wordsmith.css"

export default function Wordsmith() {
  return (
    <div id="wordsmith">
      <Heading level={0} text="Wordsmith." textAlign="left"/>
      <Heading level={7} text="A bare-bones, browser-based text formatter." textAlign="left"/>
      <Lexical />
      <footer>Copyright © 2024 • Made by <a href="https://www.linkedin.com/in/kelcimensah/" target="_blank">Kelci Mensah</a>. Hosted on <a href="https://github.com/kelcisayshello/wordsmith"><FontAwesomeIcon icon={faGithub} /></a></footer>
    </div>
  );
}