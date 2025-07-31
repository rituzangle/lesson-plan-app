// Auto-generated index file
// Path: src/components/index.ts
// Generated: 2025-07-29 20:34:01 by code-gen.py

export { default as LessonCard } from './LessonCard';
export { default as UserGreeting } from './UserGreeting';
export { WebLayoutFix } from './WebLayoutFix';
export { LoadingSpinner } from './LoadingSpinner';
export { default as StorageStats } from './StorageStats';
export { default as AuthContext } from './AuthContext';
export { QuickLessonCreator } from './QuickLessonCreator';
export { default as UserOnboarding  } from './UserOnboarding'; // UserOnboarding.tsx exports default UserOnboarding
export { ErrorBoundary } from './ErrorBoundary';

// LessonCard.tsx uses a default export, you should re-export it like this:

// For named exports (like UserGreeting), your current syntax is correct if those files export them as named exports. If they use default exports, use the same pattern as above.

// Summary:

// Use export { default as Name } from './File' for default exports.
// Use export { Name } from './File' for named exports.
// Gotcha:
// If you use export { Name } from './File' but File only has a default export, you'll get an error like the ones you mentioned. Double-check each file's export type.
// If you need to export multiple components from a single file, you can do so like this:
// export { ComponentA, ComponentB } from './File';
// This assumes that File.js exports ComponentA and ComponentB as named exports.


// If you want to export everything from a file, you can use:
// export * from './File';
// This will re-export all named exports from File.js.
// Note: Ensure that each component file exists and exports the components correctly.
// This index file serves as a central point to import and export all components in the src/components directory.
// It allows for cleaner imports in other parts of the application, as you can import components directly
// from 'src/components' instead of specifying each individual file.
// This is particularly useful for larger projects where you want to keep your imports organized and manageable.
// This file is auto-generated, so any manual changes will be overwritten.
