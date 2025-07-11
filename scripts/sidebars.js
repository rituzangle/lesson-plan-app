/**
 * Sidebar config: order & nesting of docs
 * 📚 2️⃣ Starter sidebars.js
 * See https://docusaurus.io/docs/sidebar-configuration
 * This file defines the structure of the sidebar for the documentation section.
 * It specifies the order and nesting of documents to create a user-friendly navigation experience.
 * Each entry corresponds to a document in the `docs` directory.
 * The order of entries determines their position in the sidebar.
 * 
 */

module.exports = {
  docs: [
    'intro',
    'project_guide',
    'style_guide',
    'comment_cheat_sheet',
  ],
};
// This config defines the sidebar structure for the documentation.
// Each entry corresponds to a document in the `docs` directory.
// The order of entries determines their position in the sidebar.   
// You can nest items by creating arrays within the main array.
// For example, to create a nested structure, you can do:
// module.exports = {
  docs: [
    {
      type: 'category',
      label: 'Getting Started',
      items: [
        'intro',
        'project_guide',
      ],
    },
    {
      type: 'category',
      label: 'Guides',
      items: [
        'style_guide',
        'comment_cheat_sheet',
      ],
    },
    ],
// };
// };
// This allows for better organization of related documents under a common category.
// You can add more categories or documents as needed.
// Each document should have a corresponding Markdown file in the `docs` directory.
// The sidebar will automatically reflect the structure defined here.
// For more complex configurations, refer to the Docusaurus documentation:
// https://docusaurus.io/docs/sidebar-configuration
// This file is used by Docusaurus to generate the sidebar for the documentation section.
// It helps users navigate through the documentation easily by providing a structured view of available guides and resources.
// The sidebar is automatically generated based on the entries defined in this file.
// You can customize the sidebar further by adding categories, changing labels, or nesting items as needed.
// This configuration is essential for maintaining a user-friendly documentation experience.
// The sidebar is an integral part of the Docusaurus documentation system, allowing users to quickly
// find relevant information and guides related to the K-12 Lesson Plan App.
// It enhances the usability of the documentation by providing a clear and organized structure.
// The sidebar configuration is crucial for the overall navigation experience in the documentation.
// It ensures that users can easily access different sections and guides related to the lesson planning app.
// The sidebar is automatically updated based on the entries defined in this file, making it easy to
// maintain and expand as new documentation is added.
// This file is essential for the Docusaurus documentation system, providing a structured and user-friendly
// navigation experience for users looking to learn about the K-12 Lesson Plan App.
// The sidebar configuration is a key part of the documentation, allowing users to quickly find and access
// relevant guides and resources related to the lesson planning app.
// It enhances the overall usability of the documentation by providing a clear and organized structure.
// The sidebar is automatically generated based on the entries defined in this file, making it easy to
// maintain and expand as new documentation is added.
// This configuration is crucial for providing a seamless navigation experience in the documentation,
// ensuring that users can easily access different sections and guides related to the K-12 Lesson Plan App.
// The sidebar is an integral part of the Docusaurus documentation system, allowing users to quickly
// find relevant information and guides related to the lesson planning app.
// It enhances the usability of the documentation by providing a clear and organized structure.
// The sidebar configuration is essential for the overall navigation experience in the documentation,
// ensuring that users can easily access different sections and guides related to the lesson planning app.
// The sidebar is automatically updated based on the entries defined in this file, making it easy to
// maintain and expand as new documentation is added.
// This file is used by Docusaurus to generate the sidebar for the documentation section.
// It helps users navigate through the documentation easily by providing a structured view of available guides and resources.
// The sidebar is automatically generated based on the entries defined in this file.
// You can customize the sidebar further by adding categories, changing labels, or nesting items as needed.
// This configuration is essential for maintaining a user-friendly documentation experience.
// The sidebar is an integral part of the Docusaurus documentation system, allowing users to quickly