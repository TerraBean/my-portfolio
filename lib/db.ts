import { Pool } from '@neondatabase/serverless';

// Get the database URL from environment variables
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_kB0yUrqcg6pd@ep-black-glade-a46muedm-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require';

// Create a SQL client
const pool = new Pool({ connectionString: DATABASE_URL });

// Helper functions for blog operations
export async function getAllPosts(includeUnpublished = false) {
  try {
    const publishedClause = includeUnpublished ? '' : 'WHERE published = true';
    
    const query = `
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
      ${publishedClause}
      ORDER BY p.created_at DESC
    `;
    
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

export async function getPostBySlug(slug: string) {
  try {
    const query = `
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
      WHERE p.slug = $1
    `;
    
    const result = await pool.query(query, [slug]);
    return result.rows[0] || null;
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
    const query = `
      INSERT INTO blog_posts (
        title, 
        slug, 
        content, 
        excerpt, 
        published, 
        author_id
      ) VALUES (
        $1, $2, $3, $4, $5, $6
      )
      RETURNING id, title, slug, excerpt, content, published, created_at, updated_at
    `;
    
    const result = await pool.query(query, [
      post.title,
      post.slug,
      post.content,
      post.excerpt || null,
      post.published,
      post.author_id
    ]);
    
    return result.rows[0];
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
    const updates = [];
    const values = [];
    
    if (post.title !== undefined) {
      updates.push(`title = $${updates.length + 1}`);
      values.push(post.title);
    }
    
    if (post.slug !== undefined) {
      updates.push(`slug = $${updates.length + 1}`);
      values.push(post.slug);
    }
    
    if (post.content !== undefined) {
      updates.push(`content = $${updates.length + 1}`);
      values.push(post.content);
    }
    
    if (post.excerpt !== undefined) {
      updates.push(`excerpt = $${updates.length + 1}`);
      values.push(post.excerpt);
    }
    
    if (post.published !== undefined) {
      updates.push(`published = $${updates.length + 1}`);
      values.push(post.published);
    }
    
    updates.push(`updated_at = NOW()`);
    
    if (updates.length === 0) {
      return null;
    }
    
    const updateQuery = `
      UPDATE blog_posts
      SET ${updates.join(', ')}
      WHERE id = $${updates.length + 1}
      RETURNING id, title, slug, excerpt, content, published, created_at, updated_at
    `;
    
    values.push(id);
    
    const result = await pool.query(updateQuery, values);
    return result.rows[0];
  } catch (error) {
    console.error('Error updating post:', error);
    return null;
  }
}

export async function deletePost(id: number) {
  try {
    const query = `
      DELETE FROM blog_posts
      WHERE id = $1
    `;
    
    await pool.query(query, [id]);
    return true;
  } catch (error) {
    console.error('Error deleting post:', error);
    return false;
  }
}

export async function getAllTags() {
  try {
    const query = `
      SELECT id, name, slug
      FROM tags
      ORDER BY name ASC
    `;
    
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    console.error('Error fetching tags:', error);
    return [];
  }
}

export async function getTagsForPost(postId: number) {
  try {
    const query = `
      SELECT t.id, t.name, t.slug
      FROM tags t
      JOIN blog_post_tags bpt ON t.id = bpt.tag_id
      WHERE bpt.blog_post_id = $1
      ORDER BY t.name ASC
    `;
    
    const result = await pool.query(query, [postId]);
    return result.rows;
  } catch (error) {
    console.error('Error fetching tags for post:', error);
    return [];
  }
}
