import React, { useState, useRef, useEffect } from "react";

interface MenuOption {
  value: string;
  label: string;
}

const CustomTextArea: React.FC = () => {
  const options: MenuOption[] = [
    { value: "test1", label: "This is a test of option 1" },
    { value: "test2", label: "This is a test of option 2" },
    { value: "test3", label: "This is a test of option 3" },
  ];

  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(0);
  const [prevTextAreaValue, setPrevTextAreaValue] = useState("");
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "/" && !menuVisible) {
        e.preventDefault();
        const { current } = textAreaRef;
       
        if (current) {
          const { x, y } = getCaretCoordinates(current, current.selectionEnd || 0);
          setMenuPosition({ x, y });
          setMenuVisible(true);
        }
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (menuVisible) {
        switch (e.key) {
          case "ArrowUp":
            setSelectedOptionIndex((prevIndex) =>
              prevIndex > 0 ? prevIndex - 1 : options.length - 1
            );
            break;
          case "ArrowDown":
            setSelectedOptionIndex((prevIndex) =>
              prevIndex < options.length - 1 ? prevIndex + 1 : 0
            );
            break;
          case "w":
            setSelectedOptionIndex(0);
            e.preventDefault(); // Prevent typing 'w' in textarea
            break;
          case "e":
            setSelectedOptionIndex(1);
            e.preventDefault(); // Prevent typing 'e' in textarea
            break;
          case "r":
            setSelectedOptionIndex(2);
            e.preventDefault(); // Prevent typing 'r' in textarea
            break;
          case "Enter":
            handleOptionSelection();
            break;
          case "Escape":
            setMenuVisible(false);
            break;
          default:
            break;
        }
      }
    };

    document.addEventListener("keypress", handleKeyPress);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keypress", handleKeyPress);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuVisible, options]);

  useEffect(() => {
    if (menuVisible && textAreaRef.current) {
      textAreaRef.current.focus();
    }
  }, [menuVisible]);

  useEffect(() => {
    const { current } = textAreaRef;
    if (current) {
      const currentValue = current.value;
      if (
        currentValue.length > prevTextAreaValue.length ||
        currentValue.split("\n").length > prevTextAreaValue.split("\n").length
      ) {
        const { x, y } = getCaretCoordinates(current, current.selectionEnd || 0);
        setMenuPosition({ x, y });
      }
      setPrevTextAreaValue(currentValue);
    }
  }, [prevTextAreaValue]);

  const getCaretCoordinates = (element: HTMLTextAreaElement, position: number) => {
    const { scrollTop, scrollLeft, clientTop, clientLeft } = element;
    const span = document.createElement("span");
    const style = getComputedStyle(element);

    // Font styles
    const font = `${style.fontSize} ${style.fontFamily}`;
    span.style.font = font;
    span.style.position = "absolute";
    span.style.whiteSpace = "pre-wrap";

    // Text before the cursor
    const text = element.value.substring(0, position);
    span.textContent = text.replace(/ /g, "\u00a0"); // Replace spaces with non-breaking spaces

    // Measure the width and height of the text
    document.body.appendChild(span);
    const rect = span.getBoundingClientRect();
    document.body.removeChild(span);

    // Calculate cursor position
    const x = clientLeft + scrollLeft + rect.width;
    const y = clientTop + scrollTop + rect.height;

    return { x, y };
  };

  const handleOptionClick = (option: MenuOption) => {
    setSelectedOptionIndex(options.findIndex((opt) => opt.value === option.value));
    handleOptionSelection();
  };

  const handleOptionSelection = () => {
    if (selectedOptionIndex !== -1 && selectedOptionIndex < options.length) {
      const selectedOption = options[selectedOptionIndex];
      const { current } = textAreaRef;
      if (current) {
        const value = current.value + selectedOption.value;
        current.value = value;
        current.focus();
      }
      setMenuVisible(false);
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <textarea
        ref={textAreaRef}
        style={{
          width: "100vw",
          minHeight: "100px",
          resize: "vertical",
          outline: "none",
        }}
        onKeyDown={(e) => {
          // Prevent typing in textarea when menu is visible
          if (menuVisible) {
            e.preventDefault();
          }
        }}
      ></textarea>
      {menuVisible && (
        <div
        className="menu"
          style={{
            position: "absolute",
            top: menuPosition.y , // Adjusted to show menu below cursor
            left: menuPosition.x,
    
   
            padding: "12px",
            borderRadius: "4px",
            zIndex: 9999,
          }}
        >
          {options.map((option, index) => (
            <div
              key={option.value}
              onClick={() => handleOptionClick(option)}
              style={{
                backgroundColor: selectedOptionIndex === index ? "#f0f0f0" : "transparent",
                cursor: "pointer",
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomTextArea;
