"use client";
import { useNode, useEditor } from "@craftjs/core";
import { Copy, Trash2, GripVertical, ArrowUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";

export const RenderNode = ({ render }: { render: React.ReactElement }) => {
  const { id } = useNode();
  const { actions, query } = useEditor();

  const {
    isHover,
    isActive,
    dom,
    name,
    moveable,
    deletable,
    connectors: { drag },
    parent,
  } = useNode((node) => ({
    isHover: node.events.hovered,
    isActive: node.events.selected,
    dom: node.dom,
    name: node.data.custom.displayName || node.data.displayName,
    moveable: query.node(node.id).isDraggable(),
    deletable: query.node(node.id).isDeletable(),
    parent: node.data.parent,
  }));

  const [isMounted, setIsMounted] = useState(false);
  const currentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMounted(true);
    }
  }, []);

  useEffect(() => {
    if (dom) {
      if (isActive || isHover) {
        dom.classList.add("component-selected");
      } else {
        dom.classList.remove("component-selected");
      }
    }
  }, [dom, isActive, isHover]);

  const getPos = (dom: HTMLElement) => {
    const { top, left, bottom } = dom
      ? dom.getBoundingClientRect()
      : { top: 0, left: 0, bottom: 0 };
    return {
      top: `${top > 0 ? top : bottom}px`,
      left: `${left}px`,
    };
  };

  const scroll = useRef({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const updateScroll = () => {
      scroll.current = {
        x: window.scrollX,
        y: window.scrollY,
      };
    };

    window.addEventListener("scroll", updateScroll);
    return () => window.removeEventListener("scroll", updateScroll);
  }, []);

  return (
    <>
      {isMounted && isHover && dom && document.querySelector(".craftjs-renderer")
        ? ReactDOM.createPortal(
            <div
              ref={currentRef as any}
              className="fixed flex items-center px-2 py-1 text-xs text-white bg-indigo-600 rounded shadow-lg z-[9999] gap-1"
              style={{
                left: getPos(dom as HTMLElement).left,
                top: getPos(dom as HTMLElement).top,
                transform: "translateY(-100%)",
                marginTop: "-4px",
              }}
            >
              {/* Widget Name */}
              <span className="flex-1 mr-2">{name}</span>

              {/* Move Handle */}
              {moveable ? (
                <button
                  ref={drag as any}
                  className="p-1 cursor-move hover:bg-indigo-700 rounded transition-colors"
                  title="Drag to move"
                >
                  <GripVertical className="w-3 h-3" />
                </button>
              ) : null}

              {/* Parent Select */}
              {parent && (
                <button
                  className="p-1 hover:bg-indigo-700 rounded transition-colors"
                  title="Select parent"
                  onClick={() => {
                    actions.selectNode(parent);
                  }}
                >
                  <ArrowUp className="w-3 h-3" />
                </button>
              )}

              {/* Duplicate */}
              <button
                className="p-1 hover:bg-indigo-700 rounded transition-colors"
                title="Duplicate"
                onClick={() => {
                  if (parent) {
                    try {
                      const nodeTree = query.node(id).toNodeTree();
                      actions.addNodeTree(nodeTree, parent);
                    } catch (error) {
                      console.error('Duplicate failed:', error);
                    }
                  }
                }}
              >
                <Copy className="w-3 h-3" />
              </button>

              {/* Delete */}
              {deletable ? (
                <button
                  className="p-1 hover:bg-red-700 rounded transition-colors"
                  title="Delete"
                  onMouseDown={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    actions.delete(id);
                  }}
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              ) : null}
            </div>,
            document.querySelector(".craftjs-renderer")!
          )
        : null}
      {render}
    </>
  );
};
