export const createSlug =(title) => {
    // Convert the title to lowercase and replace spaces with hyphens
    const slug = title.toLowerCase().replace(/\s+/g, '-');
  
    // Remove any special characters or symbols
    const cleanSlug = slug.replace(/[^a-z0-9-]/g, '');
  
    // Remove consecutive hyphens
    const finalSlug = cleanSlug.replace(/-+/g, '-');
  
    return finalSlug;
  }
  

  