/**
 * FontDemo Component - Demonstrates font usage in the application
 * Remove this component once you're satisfied with the font setup
 */

export default function FontDemo() {
  return (
    <div className="p-8 space-y-6 bg-gray-50 rounded-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Font Demo</h2>
      
      {/* Default font (Inter with Manrope fallback) */}
      <div className="space-y-2">
        <h3 className="font-semibold text-gray-700">Default Font (Inter)</h3>
        <p className="text-lg">The quick brown fox jumps over the lazy dog</p>
        <p className="text-sm text-gray-600">Font weights: <span className="font-light">Light</span>, <span className="font-normal">Regular</span>, <span className="font-medium">Medium</span>, <span className="font-semibold">Semibold</span>, <span className="font-bold">Bold</span></p>
      </div>

      {/* Inter font specifically */}
      <div className="space-y-2">
        <h3 className="font-semibold text-gray-700">Inter Font</h3>
        <p className="text-lg font-inter">The quick brown fox jumps over the lazy dog</p>
        <p className="text-sm text-gray-600 font-inter">Clean, modern, and highly legible - great for UI text</p>
      </div>

      {/* Manrope font specifically */}
      <div className="space-y-2">
        <h3 className="font-semibold text-gray-700">Manrope Font</h3>
        <p className="text-lg font-manrope">The quick brown fox jumps over the lazy dog</p>
        <p className="text-sm text-gray-600 font-manrope">Rounded and friendly - perfect for headings and UI elements</p>
      </div>

      {/* Instructions for Lufga */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">🎨 Want to use Lufga?</h3>
        <div className="text-sm text-blue-800 space-y-1">
          <p>1. Add Lufga font files to <code className="bg-blue-100 px-1 rounded">src/fonts/</code></p>
          <p>2. Uncomment the Lufga configuration in <code className="bg-blue-100 px-1 rounded">src/app/layout.tsx</code></p>
          <p>3. Uncomment the Lufga font family in <code className="bg-blue-100 px-1 rounded">tailwind.config.ts</code></p>
          <p>4. Use <code className="bg-blue-100 px-1 rounded">font-lufga</code> class in your components</p>
        </div>
      </div>
    </div>
  );
}