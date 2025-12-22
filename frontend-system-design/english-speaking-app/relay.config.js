module.exports = {
    // Root directory of the project
    src: './src',
    
    // Schema file location
    schema: './schema.graphql',
    
    // Language for generated files
    language: 'typescript',
    
    // Output directory for generated files
    artifactDirectory: './src/__generated__',
    
    // Exclude patterns
    excludes: [
        '**/node_modules/**',
        '**/__mocks__/**',
        '**/__generated__/**',
    ],
};
