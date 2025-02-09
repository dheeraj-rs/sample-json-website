import { useEffect } from 'react';
import webStyles from '@/data/webstyles.json';

function generateCSS(styles: any, selector: string = ''): string {
  let css = '';
  
  for (const [key, value] of Object.entries(styles)) {
    if (typeof value === 'object') {
      if (key.startsWith('&')) {
        css += `${selector}${key.slice(1)} {\n${generateCSS(value)}}\n`;
      } else if (key.startsWith('@media')) {
        css += `${key} {\n${generateCSS(value, selector)}}\n`;
      } else if (key.startsWith('.')) {
        css += `${selector} ${key} {\n${generateCSS(value)}}\n`;
      } else {
        css += `${selector}${selector ? ' ' : ''}.${key} {\n${generateCSS(value)}}\n`;
      }
    } else {
      css += `  ${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value};\n`;
    }
  }
  
  return css;
}

export function useWebStyles(theme = 'default') {
  useEffect(() => {
    const styleId = 'web-styles';
    let styleElement = document.getElementById(styleId) as HTMLStyleElement;

    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
    }

    // Generate CSS Variables
    let cssString = ':root {\n';
    
    // System Variables
    const systemVariables = webStyles.variables;
    Object.entries(systemVariables).forEach(([category, values]) => {
      if (typeof values === 'object') {
        Object.entries(values).forEach(([key, value]) => {
          if (typeof value === 'object') {
            Object.entries(value).forEach(([subKey, subValue]) => {
              cssString += `  --${category.replace('$', '')}-${key}-${subKey}: ${subValue};\n`;
            });
          } else {
            cssString += `  --${category.replace('$', '')}-${key}: ${value};\n`;
          }
        });
      }
    });
    cssString += '}\n\n';

    // CSS Custom Properties Mapping
    cssString += ':root {\n';
    Object.entries(webStyles[':root']).forEach(([key, value]) => {
      cssString += `  ${key}: ${value};\n`;
    });
    cssString += '}\n\n';

    // Global Reset Styles
    cssString += '*, *::before, *::after {\n';
    Object.entries(webStyles['*']).forEach(([key, value]) => {
      cssString += `  ${key}: ${value};\n`;
    });
    cssString += '}\n\n';

    // Base Styles
    cssString += 'html {\n  scroll-behavior: smooth;\n}\n\n';
    cssString += generateCSS(webStyles.body, 'body');

    // Layout Components
    const layoutComponents = ['navbar', 'hero', 'footer'] as const;
    type LayoutComponent = typeof layoutComponents[number];
    
    const sectionComponents = ['about', 'services', 'team', 'contact'] as const;
    type SectionComponent = typeof sectionComponents[number];

    layoutComponents.forEach(component => {
      const selector = `.${component}` as keyof typeof webStyles.components;
      if (webStyles.components[selector]) {
        cssString += generateCSS({ [component]: webStyles.components[selector] });
      }
    });

    // Section Components
    sectionComponents.forEach(component => {
      const selector = `.${component}` as keyof typeof webStyles.components;
      if (webStyles.components[selector]) {
        cssString += generateCSS({ [component]: webStyles.components[selector] });
      }
    });

    // Common Components
    Object.entries(webStyles.components).forEach(([selector, styles]) => {
      const cleanSelector = selector.replace(/^\./, '') as string;
      if (!layoutComponents.includes(cleanSelector as typeof layoutComponents[number]) && 
          !sectionComponents.includes(cleanSelector as typeof sectionComponents[number])) {
        cssString += generateCSS({ [selector.replace(/^\./, '')]: styles });
      }
    });

    // Media Queries
    if (webStyles.mediaQueries) {
      Object.entries(webStyles.mediaQueries).forEach(([query, styles]) => {
        cssString += `@media ${query} {\n${generateCSS(styles)}\n}\n`;
      });
    }

    // Update and append styles
    styleElement.textContent = cssString;
    if (!document.getElementById(styleId)) {
      document.head.appendChild(styleElement);
    }

    return () => {
      const element = document.getElementById(styleId);
      if (element?.parentNode) {
        element.parentNode.removeChild(element);
      }
    };
  }, [theme]);
} 