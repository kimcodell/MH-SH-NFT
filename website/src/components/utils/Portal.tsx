import { ReactElement, useMemo } from "react"
import { createPortal } from "react-dom";

interface PortalProps {
  children: ReactElement;
  elementQuery: string;
}

export default function Portal({children, elementQuery}: PortalProps) {
  const rootId = useMemo(() => {
    if (typeof window !== 'object') return null;
    return document.querySelector(elementQuery);
  }, [elementQuery]);

  if (!rootId) return null;

  return createPortal(children, rootId);
}