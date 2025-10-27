# Lufga Font Installation

To use Lufga font in this application, please add the following font files to this directory:

## Required Files

- `lufga-light.woff2` (weight: 300)
- `lufga-regular.woff2` (weight: 400)
- `lufga-medium.woff2` (weight: 500)
- `lufga-semibold.woff2` (weight: 600)
- `lufga-bold.woff2` (weight: 700)

## Where to Get Lufga Font

Lufga is a premium font. You can:

1. Purchase it from the original creator/foundry
2. Check if you have a license through your design tools (Figma, Adobe, etc.)
3. Download from authorized font distributors

## Alternative Fonts

The app is configured with fallback fonts that provide similar aesthetics:

1. **Inter** - Clean, modern sans-serif (Google Fonts)
2. **Manrope** - Rounded, friendly sans-serif (Google Fonts)

## Usage

Once fonts are installed, you can use them in your CSS/Tailwind classes:

```css
/* Primary font (Lufga with fallbacks) */
.font-sans { font-family: var(--font-lufga), var(--font-inter), var(--font-manrope), system-ui, sans-serif; }

/* Specific font usage */
.font-lufga { font-family: var(--font-lufga), system-ui, sans-serif; }
.font-inter { font-family: var(--font-inter), system-ui, sans-serif; }
.font-manrope { font-family: var(--font-manrope), system-ui, sans-serif; }
```

## Font Weights

- Light: `font-light` (300)
- Regular: `font-normal` (400)
- Medium: `font-medium` (500)
- Semibold: `font-semibold` (600)
- Bold: `font-bold` (700)