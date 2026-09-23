import React, { useState, useEffect, useRef } from "react";
import { usePortfolio } from "../context/PortfolioContext";
import { FiEdit2 } from "react-icons/fi";

const EditableText = ({
  value = "",
  onSave,
  as: Component = "span",
  multiline = false,
  className = "",
  style = {},
  placeholder = "Click to edit...",
  ...props
}) => {
  const { isEditMode } = usePortfolio();
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(value);
  const inputRef = useRef(null);

  useEffect(() => {
    setText(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleBlur = () => {
    setIsEditing(false);
    if (text !== value && onSave) {
      onSave(text);
    }
  };

  const handleKeyDown = (e) => {
    if (!multiline && e.key === "Enter") {
      e.preventDefault();
      handleBlur();
    } else if (e.key === "Escape") {
      setText(value);
      setIsEditing(false);
    }
  };

  if (!isEditMode) {
    return (
      <Component className={className} style={style} {...props}>
        {value}
      </Component>
    );
  }

  // When edit mode is active
  if (isEditing) {
    return multiline ? (
      <textarea
        ref={inputRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={`editable-input editable-textarea ${className}`}
        style={{
          ...style,
          width: "100%",
          minHeight: "80px",
          background: "rgba(0, 242, 254, 0.08)",
          color: "#fff",
          border: "1px dashed var(--color-primary)",
          borderRadius: "6px",
          padding: "8px",
          fontFamily: "inherit",
          fontSize: "inherit",
          lineHeight: "inherit",
          outline: "none",
        }}
        placeholder={placeholder}
      />
    ) : (
      <input
        ref={inputRef}
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={`editable-input ${className}`}
        style={{
          ...style,
          background: "rgba(0, 242, 254, 0.08)",
          color: "#fff",
          border: "1px dashed var(--color-primary)",
          borderRadius: "4px",
          padding: "2px 6px",
          fontFamily: "inherit",
          fontSize: "inherit",
          fontWeight: "inherit",
          outline: "none",
          width: "auto",
          minWidth: "60px",
        }}
        placeholder={placeholder}
      />
    );
  }

  return (
    <Component
      className={`editable-badge-wrapper ${className}`}
      onClick={() => setIsEditing(true)}
      style={{
        ...style,
        cursor: "pointer",
        position: "relative",
        display: style.display || (Component === "span" ? "inline-flex" : "block"),
        outline: "1px dashed rgba(0, 242, 254, 0.5)",
        outlineOffset: "3px",
        borderRadius: "4px",
        transition: "outline-color 0.2s ease",
      }}
      title="Click to edit text directly"
      {...props}
    >
      {value || <span style={{ opacity: 0.5, fontStyle: "italic" }}>{placeholder}</span>}
      <span
        style={{
          marginLeft: "6px",
          fontSize: "0.75em",
          color: "var(--color-primary)",
          verticalAlign: "middle",
          display: "inline-flex",
          alignItems: "center",
          opacity: 0.8,
        }}
      >
        <FiEdit2 />
      </span>
    </Component>
  );
};

export default EditableText;
