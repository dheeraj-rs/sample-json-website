import { useEffect, useCallback } from 'react';

interface StyleConfig {
  ':root'?: Record<string, string>;
  '*'?: Record<string, string>;
  body?: Record<string, string>;
  components?: Record<string, any>;
  mediaQueries?: Record<string, any>;
}

export const useStyles = (config: StyleConfig) => {
  // Convert camelCase to kebab-case
  const toKebabCase = useCallback((str: string): string => {
    return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
  }, []);

  // Process CSS rules
  const processRules = useCallback((
    rules: Record<string, any>,
    indent: string = '  '
  ): string => {
    let css = '';

    Object.entries(rules).forEach(([key, value]) => {
      if (typeof value === 'object' && value !== null) {
        if (key.startsWith('@media') || key.startsWith('@supports')) {
          css += `${indent}${key} {\n`;
          css += processRules(value, indent + '  ');
          css += `${indent}}\n`;
        } else {
          const propertyKey = toKebabCase(key);
          css += `${indent}${propertyKey}: ${value};\n`;
        }
      } else {
        const propertyKey = toKebabCase(key);
        css += `${indent}${propertyKey}: ${value};\n`;
      }
    });

    return css;
  }, [toKebabCase]);

  // Process nested selectors
  const processNestedSelectors = useCallback((
    selector: string,
    rules: Record<string, any>,
    parentSelector: string = ''
  ): string => {
    let css = '';
    const fullSelector = parentSelector
      ? selector.startsWith('&')
        ? parentSelector + selector.slice(1)
        : `${parentSelector} ${selector}`
      : selector;

    let currentRules = '';
    let nestedRules = '';

    Object.entries(rules).forEach(([key, value]) => {
      if (typeof value === 'object' && value !== null) {
        if (key.startsWith('@media')) {
          nestedRules += `${key} {\n`;
          nestedRules += processNestedSelectors(fullSelector, value);
          nestedRules += '}\n';
        } else if (key.startsWith('&') || !key.includes('&')) {
          nestedRules += processNestedSelectors(key, value, fullSelector);
        } else {
          currentRules += processRules({ [key]: value }, '  ');
        }
      } else {
        currentRules += `  ${toKebabCase(key)}: ${value};\n`;
      }
    });

    if (currentRules) {
      css += `${fullSelector} {\n${currentRules}}\n`;
    }
    css += nestedRules;

    return css;
  }, [toKebabCase, processRules]);

  // Main style processing function
  const processStyles = useCallback((config: StyleConfig): string => {
    let css = '';

    if (config[':root']) {
      css += ':root {\n';
      css += processRules(config[':root']);
      css += '}\n\n';
    }

    if (config['*']) {
      css += '* {\n';
      css += processRules(config['*']);
      css += '}\n\n';
    }

    if (config.body) {
      css += 'body {\n';
      css += processRules(config.body);
      css += '}\n\n';
    }

    if (config.components) {
      Object.entries(config.components).forEach(([selector, rules]) => {
        css += processNestedSelectors(selector, rules);
        css += '\n';
      });
    }

    if (config.mediaQueries) {
      Object.entries(config.mediaQueries).forEach(([query, rules]) => {
        css += `@media ${query} {\n`;
        Object.entries(rules as Record<string, any>).forEach(([selector, selectorRules]) => {
          css += processNestedSelectors(selector, selectorRules);
        });
        css += '}\n';
      });
    }

    return css;
  }, [processRules, processNestedSelectors]);

  // Apply styles with error handling
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const styleElement = document.createElement('style');
      styleElement.id = 'dynamic-styles';
      styleElement.setAttribute('type', 'text/css');
      styleElement.textContent = processStyles(config);

      const existingStyle = document.getElementById('dynamic-styles');
      if (existingStyle) {
        existingStyle.remove();
      }

      document.head.appendChild(styleElement);

      return () => {
        const styleToRemove = document.getElementById('dynamic-styles');
        if (styleToRemove) {
          styleToRemove.remove();
        }
      };
    } catch (error) {
      console.error('Error applying styles:', error);
      console.debug('Style config:', config);
    }
  }, [config, processStyles]);
};

export default useStyles;