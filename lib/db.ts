import { neon, neonConfig } from '@neondatabase/serverless';

// Get the database URL from environment variables
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_kB0yUrqcg6pd@ep-black-glade-a46muedm-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require';

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
