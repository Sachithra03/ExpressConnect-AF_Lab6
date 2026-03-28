let posts = [
    {
        id: 1,
        title: "First post",
        content: "This is the content of the first post.",
        author: "Admin",
        image: null
    }
];

let nextPostId = 2;

function getAllPostsSorted() {
    return [...posts].sort((a, b) => b.id - a.id);
}

function getPostsByAuthorSorted(author) {
    return getAllPostsSorted().filter(post => post.author === author);
}

function getPostById(id) {
    return posts.find(post => post.id == id);
}

function createPost({ title, content, author, image }) {
    const newPost = {
        id: nextPostId++,
        title,
        content,
        author,
        image: image || null
    };

    posts.push(newPost);
    return newPost;
}

function updatePostById(id, updates) {
    const post = getPostById(id);

    if (!post) {
        return null;
    }

    if (updates.title !== undefined) {
        post.title = updates.title;
    }

    if (updates.content !== undefined) {
        post.content = updates.content;
    }

    if (updates.author !== undefined) {
        post.author = updates.author;
    }

    if (updates.image !== undefined) {
        post.image = updates.image;
    }

    return post;
}

function deletePostById(id) {
    const index = posts.findIndex(post => post.id == id);

    if (index === -1) {
        return false;
    }

    posts.splice(index, 1);
    return true;
}

module.exports = {
    getAllPostsSorted,
    getPostsByAuthorSorted,
    getPostById,
    createPost,
    updatePostById,
    deletePostById
};
