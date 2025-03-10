import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  :root {
    --primary: #6366f1;
    --primary-dark: #4f46e5;
    --secondary: #14b8a6;
    --background: #f9fafb;
    --surface: #ffffff;
    --text: #1f2937;
    --text-light: #6b7280;
    --error: #ef4444;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    background-color: var(--background);
    color: var(--text);
    line-height: 1.5;
  }

  button {
    cursor: pointer;
    font-family: inherit;
  }

  a {
    text-decoration: none;
    color: inherit;
  }
`;