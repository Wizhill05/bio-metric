TABLE OF CONTENTS

Title	Page No
Certificate	1
Acknowledgement	2
Table of contents	3
Abstract	4
Introduction	5
Objectives	6
Methodology	7
Code 	8
Output	9
Conclusion	10
References	11

---

ABSTRACT

This project presents a modern web-based application, BioMetric, designed to provide an interactive and highly engaging user interface for medical research and question-answering. Unlike conventional conversational interfaces that offer plain text, this system utilizes advanced frontend engineering techniques to deliver contextual understanding, structured data visualization, and an immersive user experience.

The application allows users to query complex health-related topics, which are seamlessly transmitted to an external AI API. The frontend, built exclusively with React.js and Vite, dynamically processes the returned data and renders it into a highly readable, point-wise format. A standout feature is the interactive citation system, which parses markdown references into hoverable neo-brutalist tooltips, giving users immediate access to academic sources without leaving the page.

Additional intelligent UI features such as an expanding answer-stack, a responsive history sidebar, dynamic light and dark mode theming, and custom 8-bit SVG iconography significantly improve the user’s engagement. The system utilizes React Hooks for efficient state management and integrates PostHog for real-time user analytics.

This project demonstrates how modern frontend technologies and thoughtful UI/UX design can be used to build practical, user-friendly, and interactive platforms for navigating complex scientific data.

---

INTRODUCTION

With the growing popularity of complex AI tools and large datasets, there is an increasing need for frontend interfaces that organize and present dense information efficiently. Most traditional chat interfaces focus only on direct text conversation and often lack interactivity, visual hierarchy, and contextual accessibility.

This project introduces BioMetric – a highly interactive frontend application designed to elevate the user experience of medical research. The system allows users to search complex health queries and view the synthesized results in real time. The application is developed using React.js, enabling a responsive and dynamic user interface through a modular component-based architecture. This ensures reusability, smooth transitions, and efficient state management using React Hooks.

In addition to basic data rendering, the system incorporates advanced UI features such as interactive citation tooltips, an automated follow-up question array, and a visual "stack" that allows users to keep multiple answers visible concurrently. The application also features a custom-built neo-brutalist design system, completely abandoning generic UI libraries in favor of tailored CSS, vibrant accents, and custom 8-bit pixel art icons. 

Overall, this project demonstrates how modern frontend frameworks combined with strict design principles can create a practical, interactive, and highly user-friendly data consumption system.

---

OBJECTIVES

AIM
To develop an interactive, responsive, and visually distinct web application using React.js that provides a superior user experience for exploring and reading AI-generated medical research.

OBJECTIVES
1. To design and develop a responsive and visually appealing web application using React.js with a modular component-based architecture.
2. To implement a unique neo-brutalist design system utilizing vanilla CSS, custom variables, and a cohesive light/dark mode theme toggle.
3. To create a fully custom library of 8-bit pixel art SVG icons, ensuring a distinct and consistent visual identity without relying on external icon libraries.
4. To implement an efficient user input system and an asynchronous fetch pipeline to seamlessly communicate with external research APIs.
5. To design an "answer stack" UI pattern that dynamically renders multiple sequential search results without losing previous context.
6. To develop an interactive citation parser that converts markdown references into hoverable, data-rich tooltips containing specific academic paper details.
7. To implement secure, client-side authentication flows and persistent chat history rendering using the Supabase JavaScript client.
8. To integrate frontend analytics using PostHog to track user interactions, button clicks, and page views without compromising UI performance.
9. To ensure efficient state management using React Hooks (useState, useEffect, useCallback) for smooth data flow and real-time UI updates.

---

METHODOLOGY

1. The system begins by providing a visually engaging user interface where users can input complex medical queries via a centralized search component.
2. The UI state is captured and managed in the frontend using React Hooks, disabling inputs and triggering custom CSS loading animations while data is being fetched.
3. The frontend executes an asynchronous fetch request to an external backend API, handling promises and gracefully catching any network errors to display user-friendly error banners.
4. Upon receiving the JSON response, the frontend dynamically parses the complex data structure, separating the core markdown answer from the metadata and citation lists.
5. The parsed text undergoes frontend preprocessing to identify markdown citations (e.g., `[1]`), converting them into interactive React components.
6. When a user hovers over these interactive citations, the frontend triggers an absolutely positioned, neo-brutalist tooltip containing the exact paper's title, authors, and abstract snippet.
7. A dynamic answer-stack array is maintained in the application state. Instead of overwriting previous answers, new results are appended to the stack, and previous results are collapsed into interactive accordions.
8. A secondary UI module captures suggested follow-up questions from the API and renders them as clickable tags, automatically triggering new state updates when interacted with.
9. User sessions and authentication states are managed via the Supabase client. The frontend utilizes `onAuthStateChange` listeners to conditionally render gated UI components, such as the persistent History Sidebar.
10. The History Sidebar component maps over historical user queries, allowing the user to click past searches and instantly restore the application state to that specific query.
11. A comprehensive theming system is implemented using CSS variables, allowing users to toggle between Light and Dark modes. The state is persisted in the browser's `localStorage` for future visits.
12. PostHog analytics is initialized in the application root, capturing custom events directly from component interaction handlers (e.g., `onClick` and `onSubmit`).
13. The application is strictly styled using custom CSS, avoiding heavy CSS frameworks to ensure maximum rendering speed, precise pixel-art rendering via `shape-rendering: crispEdges`, and fine-tuned neo-brutalist borders and shadows.
14. The application is tested across different browsers and mobile devices to ensure complete responsive compatibility via CSS media queries and flexbox layouts.
15. The overall frontend system is designed with a modular architecture, breaking down complex views into reusable components like `SearchResults`, `HistorySidebar`, and `FollowUpQuestions`.

---

CODE

[Insert Frontend React/CSS Code Snippets Here]

---

OUTPUT

[Insert Application Screenshots Here]

---

CONCLUSION

This project successfully demonstrates the development of an interactive and visually distinct frontend system using modern web technologies. By integrating complex API state management, interactive tooltips, and a custom design language within a React-based architecture, the system provides both flawless functionality and deep user engagement.

The application goes beyond basic data-fetching by incorporating features such as custom markdown parsing, persistent UI states across authentications, and a modular answer-stacking interface, making it a highly effective tool for practical usage. The component-based architecture ensures scalability and ease of enhancement.

Overall, the project highlights how meticulous frontend engineering combined with strong design principles can result in efficient, user-centric, and accessible web applications. It also establishes a strong foundation for future frontend advancements such as internationalization, deeper accessibility (a11y) improvements, and progressive web app (PWA) capabilities.

---

REFERENCES

1. React.js Official Documentation - https://react.dev/
2. Vite Build Tool - https://vitejs.dev/
3. JavaScript (MDN Web Docs) - https://developer.mozilla.org/en-US/docs/Web/JavaScript
4. Supabase JavaScript Client - https://supabase.com/docs/reference/javascript
5. PostHog JS Documentation - https://posthog.com/docs/libraries/js
6. CSS Custom Properties (MDN) - https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties
