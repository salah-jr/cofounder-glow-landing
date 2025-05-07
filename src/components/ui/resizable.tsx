
import { GripVertical } from "lucide-react"
import * as ResizablePrimitive from "react-resizable-panels"

import { cn } from "@/lib/utils"

const ResizablePanelGroup = ({
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelGroup>) => (
  <ResizablePrimitive.PanelGroup
    className={cn(
      "flex h-full w-full data-[panel-group-direction=vertical]:flex-col",
      className
    )}
    {...props}
  />
)

// Using the basic ResizablePanel without custom collapsible functionality
const ResizablePanel = ({
  className,
  defaultSize,
  collapsible = false,
  collapsedSize = 0,
  minSize = 0,
  isCollapsed = false,
  onCollapse,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.Panel> & {
  collapsible?: boolean,
  collapsedSize?: number,
  isCollapsed?: boolean,
  onCollapse?: (collapsed: boolean) => void
}) => {
  return (
    <ResizablePrimitive.Panel 
      defaultSize={defaultSize}
      minSize={collapsible && isCollapsed ? collapsedSize : minSize}
      className={cn(
        "transition-all duration-300",
        isCollapsed && "min-w-[0px] max-w-[0px]",
        className
      )}
      {...props}
    />
  )
}

// Enhanced to support bidirectional resizing with improved responsiveness
const ResizableHandle = ({
  withHandle,
  className,
  hidden = false,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelResizeHandle> & {
  withHandle?: boolean,
  hidden?: boolean
}) => {
  // Extract updateThrottleMilliseconds if it exists in props before passing to ResizablePrimitive.PanelResizeHandle
  const { updateThrottleMilliseconds, ...restProps } = props as any;
  
  return (
    <ResizablePrimitive.PanelResizeHandle
      className={cn(
        "relative flex w-px items-center justify-center cursor-col-resize",
        "after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1",
        "data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full",
        "data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full",
        "data-[panel-group-direction=vertical]:after:-translate-y-1/2 data-[panel-group-direction=vertical]:after:translate-x-0",
        "group hover:after:bg-white/20",
        "[&[data-panel-group-direction=vertical]>div]:rotate-90",
        hidden && "opacity-0 pointer-events-none",
        className
      )}
      // Maximum responsiveness settings for fluid resize experience
      tagName="div"
      data-superfluid="true"
      data-high-precision="true"
      style={{ 
        // Enhanced hit area and performance optimizations
        touchAction: "none",
        userSelect: "none",
        willChange: "transform",
        backfaceVisibility: "hidden",
        transform: "translateZ(0)",
        // Improved responsiveness - fixed TypeScript error by removing imageRendering
        pointerEvents: "auto"
      }}
      {...restProps}
    >
      {withHandle && (
        <div className="z-10 flex h-9 w-2 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm transition-colors group-hover:bg-white/20 group-hover:scale-105">
          <GripVertical className="h-3 w-3 text-white/50 group-hover:text-white/70 transition-colors" />
        </div>
      )}
    </ResizablePrimitive.PanelResizeHandle>
  )
}

export { ResizablePanelGroup, ResizablePanel, ResizableHandle }
