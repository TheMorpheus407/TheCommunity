/**
 * @fileoverview Mermaid diagram rendering component.
 * @module components/MermaidDiagram
 */

const { useState, useEffect, createElement } = React;

/**
 * Component that renders Mermaid diagrams from code.
 * @param {Object} props - Component props
 * @param {string} props.id - Unique identifier for the diagram
 * @param {string} props.code - Mermaid diagram code
 * @returns {React.Element} Rendered diagram or error message
 */
export function MermaidDiagram({ id, code }) {
  const [svgContent, setSvgContent] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const renderDiagram = async () => {
      try {
        // Wait for mermaid to be available
        if (!window.mermaid) {
          if (isMounted) setError('Mermaid library not loaded');
          return;
        }

        // Render the diagram
        const { svg } = await window.mermaid.render(id, code);
        if (isMounted) {
          setSvgContent(svg);
          setError(null);
        }
      } catch (err) {
        console.error('Mermaid rendering error:', err);
        if (isMounted) setError('Failed to render diagram');
      }
    };

    renderDiagram();

    return () => {
      isMounted = false;
    };
  }, [id, code]);

  if (error) {
    return createElement('div', {
      className: 'mermaid-error'
    },
      createElement('details', null,
        createElement('summary', null, '⚠️ Diagram Error'),
        createElement('pre', null, code)
      )
    );
  }

  if (!svgContent) {
    return createElement('div', {
      className: 'mermaid-diagram'
    }, 'Loading diagram...');
  }

  return createElement('div', {
    className: 'mermaid-diagram',
    dangerouslySetInnerHTML: { __html: svgContent }
  });
}
