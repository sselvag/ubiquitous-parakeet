async function commentHandler(event) {
    event.preventDefault();

    const comment_text = document.querySelector('input[name="comment-text"]').value.trim();

    const post_id = window.location.toString().split('/')[
        window.location.toString().split('/').length - 1
    ];

    console.log(comment_text)
    console.log(post_id)

    if (comment_text) {
        const response = await fetch('/api/comments', {
            method: 'POST',
            body: JSON.stringify({
                post_id,
                comment_text
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            document.location.reload();
        } else {
            console.log(response.statusText)
        }
    }
}

document.querySelector('.comment-form').addEventListener('submit', commentHandler);