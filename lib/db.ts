import { neon, neonConfig } from '@neondatabase/serverless';

// Get the database URL from environment variables
const DATABASE_URL = process.env.NEW_DATABASE_URL || 'postgresql://neondb_owner:npg_Dl5GucfaZYS9@ep-frosty-boat-abcvz7ro-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require';

// Create a SQL client
const sql = neon(DATABASE_URL);

// Helper functions for blog operations
export async function getAllPosts(includeUnpublished = false) {
  try {
    // Use conditional query based on includeUnpublished parameter
    if (includeUnpublished) {
      const result = await sql`
        SELECT 
          p.id, 
          p.title, 
          p.slug, 
          p.excerpt, 
          p.content, 
          p.published, 
          p.created_at, 
          p.updated_at,
          u.name as author_name
        FROM blog_posts p
        JOIN users u ON p.author_id = u.id
        ORDER BY p.created_at DESC
      `;
      return result;
    } else {
      const result = await sql`
        SELECT 
          p.id, 
          p.title, 
          p.slug, 
          p.excerpt, 
          p.content, 
          p.published, 
          p.created_at, 
          p.updated_at,
          u.name as author_name
        FROM blog_posts p
        JOIN users u ON p.author_id = u.id
        WHERE published = true
        ORDER BY p.created_at DESC
      `;
      return result;
    }
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

export async function getPostBySlug(slug: string) {
  try {
    const result = await sql`
      SELECT 
        p.id, 
        p.title, 
        p.slug, 
        p.excerpt, 
        p.content, 
        p.published, 
        p.created_at, 
        p.updated_at,
        p.author_id,
        u.name as author_name
      FROM blog_posts p
      JOIN users u ON p.author_id = u.id
      WHERE p.slug = ${slug}
    `;
    
    return result[0] || null;
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

export async function getPostById(id: number) {
  try {
    const result = await sql`
      SELECT 
        p.id, 
        p.title, 
        p.slug, 
        p.excerpt, 
        p.content, 
        p.published, 
        p.created_at, 
        p.updated_at,
        p.author_id,
        u.name as author_name
      FROM blog_posts p
      JOIN users u ON p.author_id = u.id
      WHERE p.id = ${id}
    `;
    
    return result[0] || null;
  } catch (error) {
    console.error('Error fetching post by ID:', error);
    return null;
  }
}

export async function createPost(post: {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  published: boolean;
  author_id: number;
}) {
  try {
    const result = await sql`
      INSERT INTO blog_posts (
        title, 
        slug, 
        content, 
        excerpt, 
        published, 
        author_id
      ) VALUES (
        ${post.title}, 
        ${post.slug}, 
        ${post.content}, 
        ${post.excerpt || null}, 
        ${post.published}, 
        ${post.author_id}
      )
      RETURNING id, title, slug, excerpt, content, published, created_at, updated_at
    `;
    
    return result[0];
  } catch (error) {
    console.error('Error creating post:', error);
    return null;
  }
}

export async function updatePost(
  id: number,
  post: {
    title?: string;
    slug?: string;
    content?: string;
    excerpt?: string;
    published?: boolean;
  }
) {
  try {
    // Handle each field update individually to avoid dynamic SQL construction
    // This is more verbose but safer and avoids TypeScript errors
    
    // First, get the current post
    const currentPost = await sql`
      SELECT * FROM blog_posts WHERE id = ${id}
    `;
    
    if (!currentPost.length) {
      return null;
    }
    
    // Update with new values or keep existing ones
    const title = post.title !== undefined ? post.title : currentPost[0].title;
    const slug = post.slug !== undefined ? post.slug : currentPost[0].slug;
    const content = post.content !== undefined ? post.content : currentPost[0].content;
    const excerpt = post.excerpt !== undefined ? post.excerpt : currentPost[0].excerpt;
    const published = post.published !== undefined ? post.published : currentPost[0].published;
    
    // Perform the update with all fields
    const result = await sql`
      UPDATE blog_posts
      SET 
        title = ${title},
        slug = ${slug},
        content = ${content},
        excerpt = ${excerpt},
        published = ${published},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING id, title, slug, excerpt, content, published, created_at, updated_at
    `;
    
    return result[0];
  } catch (error) {
    console.error('Error updating post:', error);
    return null;
  }
}

export async function deletePost(id: number) {
  try {
    await sql`
      DELETE FROM blog_posts
      WHERE id = ${id}
    `;
    
    return true;
  } catch (error) {
    console.error('Error deleting post:', error);
    return false;
  }
}

export async function getAllTags() {
  try {
    const result = await sql`
      SELECT id, name, slug
      FROM tags
      ORDER BY name ASC
    `;
    
    return result;
  } catch (error) {
    console.error('Error fetching tags:', error);
    return [];
  }
}

export async function getTagById(id: number) {
  try {
    const result = await sql`
      SELECT id, name, slug
      FROM tags
      WHERE id = ${id}
    `;
    
    return result[0] || null;
  } catch (error) {
    console.error('Error fetching tag by ID:', error);
    return null;
  }
}

export async function getTagsForPost(postId: number) {
  try {
    const result = await sql`
      SELECT t.id, t.name, t.slug
      FROM tags t
      JOIN blog_post_tags bpt ON t.id = bpt.tag_id
      WHERE bpt.blog_post_id = ${postId}
      ORDER BY t.name ASC
    `;
    
    return result;
  } catch (error) {
    console.error('Error fetching tags for post:', error);
    return [];
  }
}

export async function getAllCategories() {
  try {
    const result = await sql`
      SELECT id, name, slug, description
      FROM categories
      ORDER BY name ASC
    `;
    
    return result;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export async function getCategoriesForPost(postId: number) {
  try {
    const result = await sql`
      SELECT c.id, c.name, c.slug, c.description
      FROM categories c
      JOIN blog_post_categories bpc ON c.id = bpc.category_id
      WHERE bpc.blog_post_id = ${postId}
      ORDER BY c.name ASC
    `;
    
    return result;
  } catch (error) {
    console.error('Error fetching categories for post:', error);
    return [];
  }
}

export async function getPostsByCategory(categorySlug: string) {
  try {
    const result = await sql`
      SELECT 
        p.id, 
        p.title, 
        p.slug, 
        p.excerpt, 
        p.content, 
        p.published, 
        p.created_at, 
        p.updated_at,
        u.name as author_name
      FROM blog_posts p
      JOIN users u ON p.author_id = u.id
      JOIN blog_post_categories bpc ON p.id = bpc.blog_post_id
      JOIN categories c ON bpc.category_id = c.id
      WHERE c.slug = ${categorySlug} AND p.published = true
      ORDER BY p.created_at DESC
    `;
    
    return result;
  } catch (error) {
    console.error('Error fetching posts by category:', error);
    return [];
  }
}

export async function getPostsByTag(tagSlug: string) {
  try {
    const result = await sql`
      SELECT 
        p.id, 
        p.title, 
        p.slug, 
        p.excerpt, 
        p.content, 
        p.published, 
        p.created_at, 
        p.updated_at,
        u.name as author_name
      FROM blog_posts p
      JOIN users u ON p.author_id = u.id
      JOIN blog_post_tags bpt ON p.id = bpt.blog_post_id
      JOIN tags t ON bpt.tag_id = t.id
      WHERE t.slug = ${tagSlug} AND p.published = true
      ORDER BY p.created_at DESC
    `;
    
    return result;
  } catch (error) {
    console.error('Error fetching posts by tag:', error);
    return [];
  }
}

export async function addCategoryToPost(postId: number, categoryId: number) {
  try {
    await sql`
      INSERT INTO blog_post_categories (blog_post_id, category_id)
      VALUES (${postId}, ${categoryId})
      ON CONFLICT (blog_post_id, category_id) DO NOTHING
    `;
    return true;
  } catch (error) {
    console.error('Error adding category to post:', error);
    return false;
  }
}

export async function removeCategoryFromPost(postId: number, categoryId: number) {
  try {
    await sql`
      DELETE FROM blog_post_categories
      WHERE blog_post_id = ${postId} AND category_id = ${categoryId}
    `;
    return true;
  } catch (error) {
    console.error('Error removing category from post:', error);
    return false;
  }
}

export async function createCategory(category: { name: string; slug: string; description?: string }) {
  try {
    const result = await sql`
      INSERT INTO categories (name, slug, description)
      VALUES (${category.name}, ${category.slug}, ${category.description || null})
      RETURNING id, name, slug, description
    `;
    return result[0];
  } catch (error) {
    console.error('Error creating category:', error);
    return null;
  }
}

export async function updateCategory(
  id: number,
  category: { name?: string; slug?: string; description?: string }
) {
  try {
    // Get current category
    const currentCategory = await sql`
      SELECT * FROM categories WHERE id = ${id}
    `;
    
    if (!currentCategory.length) {
      return null;
    }
    
    // Update with new values or keep existing ones
    const name = category.name !== undefined ? category.name : currentCategory[0].name;
    const slug = category.slug !== undefined ? category.slug : currentCategory[0].slug;
    const description = category.description !== undefined ? category.description : currentCategory[0].description;
    
    const result = await sql`
      UPDATE categories
      SET 
        name = ${name},
        slug = ${slug},
        description = ${description},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING id, name, slug, description
    `;
    
    return result[0];
  } catch (error) {
    console.error('Error updating category:', error);
    return null;
  }
}

export async function deleteCategory(id: number) {
  try {
    await sql`
      DELETE FROM categories
      WHERE id = ${id}
    `;
    
    return true;
  } catch (error) {
    console.error('Error deleting category:', error);
    return false;
  }
}

export async function addTagToPost(postId: number, tagId: number) {
  try {
    await sql`
      INSERT INTO blog_post_tags (blog_post_id, tag_id)
      VALUES (${postId}, ${tagId})
      ON CONFLICT (blog_post_id, tag_id) DO NOTHING
    `;
    return true;
  } catch (error) {
    console.error('Error adding tag to post:', error);
    return false;
  }
}

export async function removeTagFromPost(postId: number, tagId: number) {
  try {
    await sql`
      DELETE FROM blog_post_tags
      WHERE blog_post_id = ${postId} AND tag_id = ${tagId}
    `;
    return true;
  } catch (error) {
    console.error('Error removing tag from post:', error);
    return false;
  }
}

export async function createTag(tag: { name: string; slug: string }) {
  try {
    const result = await sql`
      INSERT INTO tags (name, slug)
      VALUES (${tag.name}, ${tag.slug})
      RETURNING id, name, slug
    `;
    return result[0];
  } catch (error) {
    console.error('Error creating tag:', error);
    return null;
  }
}

export async function updateTag({ id, name, slug }: { id: number; name: string; slug: string }) {
  try {
    await sql`
      UPDATE tags
      SET name = ${name}, slug = ${slug}
      WHERE id = ${id}
    `;
    
    return true;
  } catch (error) {
    console.error('Error updating tag:', error);
    return false;
  }
}

export async function deleteTag(id: number) {
  try {
    await sql`
      DELETE FROM tags
      WHERE id = ${id}
    `;
    
    return true;
  } catch (error) {
    console.error('Error deleting tag:', error);
    return false;
  }
}

// Export the sql client for direct use
export { sql };

// News-related database operations
export async function saveScrapedNews(newsItems: Array<{
  title: string;
  content: string;
  url: string;
  publishedDate: string;
  source: string;
  enhancedContent?: string;
}>) {
  try {
    const results = [];
    for (const item of newsItems) {
      const result = await sql`
        INSERT INTO scraped_news (
          title, 
          content, 
          url, 
          published_date, 
          source,
          enhanced_content,
          created_at
        ) VALUES (
          ${item.title}, 
          ${item.content}, 
          ${item.url}, 
          ${item.publishedDate}, 
          ${item.source},
          ${item.enhancedContent || null},
          NOW()
        )
        ON CONFLICT (url) DO UPDATE SET
          title = EXCLUDED.title,
          content = EXCLUDED.content,
          enhanced_content = EXCLUDED.enhanced_content,
          updated_at = NOW()
        RETURNING id, title, url, source, created_at
      `;
      results.push(result[0]);
    }
    return results;
  } catch (error) {
    console.error('Error saving scraped news:', error);
    return [];
  }
}

export async function getAllScrapedNews(limit = 50) {
  try {
    const result = await sql`
      SELECT 
        id, 
        title, 
        content, 
        url, 
        published_date, 
        source,
        enhanced_content,
        created_at,
        updated_at
      FROM scraped_news
      ORDER BY published_date DESC, created_at DESC
      LIMIT ${limit}
    `;
    return result;
  } catch (error) {
    console.error('Error fetching scraped news:', error);
    return [];
  }
}

export async function getScrapedNewsBySource(source: string, limit = 20) {
  try {
    const result = await sql`
      SELECT
        id, 
        title, 
        content, 
        url, 
        published_date, 
        source,
        enhanced_content,
        created_at,
        updated_at
      FROM scraped_news
      WHERE source = ${source}
      ORDER BY published_date DESC, created_at DESC
      LIMIT ${limit}
    `;
    return result;
  } catch (error) {
    console.error('Error fetching scraped news by source:', error);
    return [];
  }
}

export async function deleteScrapedNews(id: number) {
  try {
    await sql`
      DELETE FROM scraped_news
      WHERE id = ${id}
    `;
    
    return true;
  } catch (error) {
    console.error('Error deleting scraped news:', error);
    return false;
  }
} 
       