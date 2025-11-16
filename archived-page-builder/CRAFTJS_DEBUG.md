# Craft.js Integration Debug Log

## Issues Identified

1. **Drag and Drop Not Working** - Widgets can be moved slightly but cannot be dropped into canvas
2. **Click Selection Not Working** - Clicking elements in canvas doesn't select them
3. **Settings Panel Empty** - Right panel shows "Select an element" even when clicking

## Investigation Steps

### Step 1: Check Editor Initialization
- Editor component wraps everything ✓
- Resolver includes all widgets ✓
- enabled={true} is set ✓

### Step 2: Check Frame Setup
- Frame component is present in Viewport ✓
- But Frame might not be properly connected to deserialized data

### Step 3: Check Widget Configuration
- Container has isCanvas: true ✓
- Section has isCanvas: true ✓
- Column has isCanvas: true ✓
- InnerSection has isCanvas: true ✓

### Step 4: Check Connectors
- Toolbox uses connectors.create() ✓
- Widgets use connect(drag(ref)) ✓

## Root Cause Analysis

The problem is likely that:
1. The Frame in Viewport is creating a NEW empty canvas
2. The deserialized data is loaded but not connected to the Frame
3. Need to either:
   - Load data directly into Frame as children
   - OR use Frame without children and let deserialize populate it

## Solution Approach

The Craft.js pattern should be:
1. Editor wraps everything
2. Frame is the canvas root
3. deserialize() loads data into the Frame's ROOT node
4. Widgets must be properly connected with useNode()

Let me check if the ROOT node is being created correctly...
