import React from 'react';

// CSS Style Sheet
import '../css/headings.css';

interface HeadingProps {
  level: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
  text: string;
  color?: string;
  textAlign?: 'left' | 'center' | 'right'; // Use a string literal type
}

const Heading: React.FC<HeadingProps> = ({ level, text, color, textAlign }) => {
  let HeadingTag: keyof JSX.IntrinsicElements = 'h1';
  let className = "heading";

  if (level === 0) {
    className += " title-heading";
  } else if (level === 7) {
    className += " paragraph-heading";
  } else {
    HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;
  }

  const style: React.CSSProperties = {
    color: color || '#494845',
    textAlign: textAlign || 'left', // Default to left
  };

  return <HeadingTag style={style} className={className}>{text}</HeadingTag>;
};

export default Heading;