/**
 * News Feed System - TypeScript Implementation
 * 
 * Main entry point that demonstrates the usage of the system.
 */

export * from './models';
export * from './store';
export * from './services';
export * from './controllers';
export * from './utils';

// ============================================
// Demo Usage
// ============================================

import { feedController } from './controllers';
import { formatRelativeTime, formatCount } from './utils';

async function demo() {
    console.log('🚀 News Feed System Demo\n');
    console.log('='.repeat(50));

    // Initialize
    await feedController.initialize();
    const user = feedController.getCurrentUser();
    console.log(`\n👤 Current User: ${user?.name} (@${user?.username})`);

    // Subscribe to store changes
    const store = feedController.getStore();
    const unsubscribe = store.subscribe(() => {
        const state = store.getState();
        console.log(`\n📊 Store Update:`);
        console.log(`   Posts: ${state.posts.length}`);
        console.log(`   Loading: ${state.isLoading}`);
        console.log(`   Has More: ${state.pagination.hasMore}`);
    });

    // Load feed
    console.log('\n📥 Loading feed...');
    await feedController.loadFeed();

    // Display posts
    const posts = store.getPosts();
    console.log(`\n📰 Feed Posts (showing first 3):`);
    console.log('='.repeat(50));

    posts.slice(0, 3).forEach((post, i) => {
        console.log(`\n[${i + 1}] ${post.author.name} (@${post.author.username})`);
        console.log(`    ${formatRelativeTime(post.createdAt)}`);
        console.log(`    "${post.content.slice(0, 50)}..."`);
        console.log(`    👍 ${formatCount(post.reactions.like)} | 💬 ${formatCount(post.commentCount)} comments`);
    });

    // Create a post
    console.log('\n\n✏️ Creating new post...');
    const newPost = await feedController.createPost({
        content: 'Hello from the News Feed System! 🎉'
    });

    if (newPost) {
        console.log(`   Created: "${newPost.content}"`);
        console.log(`   ID: ${newPost.id}`);
    }

    // Toggle reaction
    if (posts[0]) {
        console.log(`\n❤️ Adding reaction to first post...`);
        await feedController.toggleReaction(posts[0].id, 'love');

        const updatedPost = store.getPostById(posts[0].id);
        console.log(`   Love count: ${updatedPost?.reactions.love}`);
        console.log(`   User reaction: ${updatedPost?.userReaction}`);
    }

    // Load more
    console.log('\n📥 Loading more posts...');
    await feedController.loadMore();
    console.log(`   Total posts: ${store.getPosts().length}`);

    // Cleanup
    unsubscribe();
    console.log('\n✅ Demo complete!');
}

// Run demo if this is the main module
if (require.main === module) {
    demo().catch(console.error);
}
