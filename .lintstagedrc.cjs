module.exports = {
  '*.{js,jsx,ts,tsx}': files => {
    // Filter out dist files
    const nonDistFiles = files.filter(file => !file.includes('/dist/') && !file.includes('\\dist\\'));
    if (nonDistFiles.length === 0) return [];
    
    // Process files in smaller batches to avoid command line length limits
    const commands = [];
    
    // Process files in chunks of 5
    for (let i = 0; i < nonDistFiles.length; i += 5) {
      const chunk = nonDistFiles.slice(i, i + 5);
      commands.push(`eslint --fix ${chunk.join(' ')}`);
    }
    
    // Do the same for prettier
    for (let i = 0; i < nonDistFiles.length; i += 5) {
      const chunk = nonDistFiles.slice(i, i + 5);
      commands.push(`prettier --write ${chunk.join(' ')}`);
    }
    
    return commands;
  },
  '*.{json,md,yml,yaml}': files => {
    // Filter out dist files
    const nonDistFiles = files.filter(file => !file.includes('/dist/') && !file.includes('\\dist\\'));
    if (nonDistFiles.length === 0) return [];
    
    // Process files in smaller batches
    const commands = [];
    
    // Process files in chunks of 10
    for (let i = 0; i < nonDistFiles.length; i += 10) {
      const chunk = nonDistFiles.slice(i, i + 10);
      commands.push(`prettier --write ${chunk.join(' ')}`);
    }
    
    return commands;
  },
}; 