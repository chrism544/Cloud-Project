/**
 * Drag-and-Drop Debug Logging Utility
 * Tracks drag operations through the Craft.js lifecycle
 */

export interface DragDebugEvent {
  timestamp: number;
  type: 'drag_start' | 'drag_enter' | 'drag_over' | 'drag_leave' | 'drop' | 'drag_end' | 'error';
  widget?: string;
  containerName?: string;
  nodeId?: string;
  error?: string;
  details?: Record<string, any>;
}

class DragDebugger {
  private events: DragDebugEvent[] = [];
  private maxEvents = 100;

  log(event: Omit<DragDebugEvent, 'timestamp'>) {
    const fullEvent: DragDebugEvent = {
      ...event,
      timestamp: Date.now(),
    };

    this.events.push(fullEvent);

    // Keep only recent events
    if (this.events.length > this.maxEvents) {
      this.events.shift();
    }

    // Console output with styling
    const colors = {
      drag_start: '#4CAF50',
      drag_enter: '#2196F3',
      drag_over: '#00BCD4',
      drag_leave: '#FF9800',
      drop: '#8BC34A',
      drag_end: '#F44336',
      error: '#E91E63',
    };

    const style = `color: white; background-color: ${colors[event.type]}; padding: 2px 6px; border-radius: 3px; font-weight: bold;`;
    console.log(
      `%c[DRAG-DROP-${event.type.toUpperCase()}]`,
      style,
      event.widget || event.containerName || 'unknown',
      event.details
    );
  }

  logDragStart(widgetName: string, nodeId: string) {
    this.log({
      type: 'drag_start',
      widget: widgetName,
      nodeId,
      details: { message: 'Widget drag initiated' },
    });
  }

  logDragEnter(containerName: string, nodeId: string) {
    this.log({
      type: 'drag_enter',
      containerName,
      nodeId,
      details: { message: 'Drag entered container - check if it accepts drops' },
    });
  }

  logDragOver(containerName: string, nodeId: string) {
    this.log({
      type: 'drag_over',
      containerName,
      nodeId,
      details: { message: 'Drag over container' },
    });
  }

  logDrop(widgetName: string, containerName: string, nodeId: string) {
    this.log({
      type: 'drop',
      widget: widgetName,
      containerName,
      nodeId,
      details: { message: 'Widget dropped into container' },
    });
  }

  logDragEnd(widgetName: string, success: boolean) {
    this.log({
      type: 'drag_end',
      widget: widgetName,
      details: { success, message: success ? 'Drop successful' : 'Drop cancelled or failed' },
    });
  }

  logError(error: string, context?: Record<string, any>) {
    this.log({
      type: 'error',
      error,
      details: context,
    });
  }

  getEvents() {
    return [...this.events];
  }

  clear() {
    this.events = [];
    console.log('%c[DRAG-DROP-DEBUG] Events cleared', 'color: gray; font-style: italic;');
  }

  printSummary() {
    console.group('%c[DRAG-DROP-DEBUG] Event Summary', 'color: #673AB7; font-weight: bold;');
    const eventCounts = this.events.reduce(
      (acc, event) => {
        acc[event.type] = (acc[event.type] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    Object.entries(eventCounts).forEach(([type, count]) => {
      console.log(`${type}: ${count}`);
    });

    console.groupEnd();
  }
}

export const dragDebugger = new DragDebugger();

// Make it globally available in dev mode
if (typeof window !== 'undefined') {
  (window as any).__dragDebugger = dragDebugger;
}
