async function handleNewPost(event) {
    event.preventDefault();

    const title = document.querySelector('input[name="post-title"]').value.trim();
    const post_content = document.querySelector('input[name="post-content"').value.trim();

    console.log(title);
    console.log(post_content);

    const response = await fetch('/api/posts', {
        method: 'POST', 
        body: JSON.stringify({
            title,
            post_content
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (response.ok) {
        document.location.replace('/dashboard');
    } else {
        console.log(response.statusText);
    }
}

document.querySelector('.new-post').addEventListener('submit', handleNewPost);