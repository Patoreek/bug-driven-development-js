import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

export interface DropdownOption {
  id: string;
  label: string;
}

interface DropdownProps {
  label: string;
  options: DropdownOption[];
  onSelect: (option: DropdownOption) => void;
}

export function Dropdown({ label, options, onSelect }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [portalContainer] = useState(() => {
    const el = document.createElement("div");
    el.setAttribute("data-testid", "portal-container");
    return el;
  });

  useEffect(() => {
    document.body.appendChild(portalContainer);
    return () => {
      document.body.removeChild(portalContainer);
    };
  }, [portalContainer]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (option: DropdownOption) => {
    onSelect(option);
    setIsOpen(false);
  };

  return (
    <>
      <button
        ref={buttonRef}
        onClick={handleToggle}
        data-testid="dropdown-trigger"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        {label}
      </button>
      {isOpen &&
        createPortal(
          // BUG: No stopPropagation — clicks here bubble through the React tree
          // to parent components, even though this is rendered in a portal
          <ul role="listbox" data-testid="dropdown-menu">
            {options.map((option) => (
              <li
                key={option.id}
                role="option"
                data-testid={`option-${option.id}`}
                onClick={() => handleSelect(option)}
              >
                {option.label}
              </li>
            ))}
          </ul>,
          portalContainer
        )}
    </>
  );
}

interface ToolbarProps {
  onToolbarClick: () => void;
  children: React.ReactNode;
}

export function Toolbar({ onToolbarClick, children }: ToolbarProps) {
  return (
    <div onClick={onToolbarClick} data-testid="toolbar" role="toolbar">
      {children}
    </div>
  );
}
