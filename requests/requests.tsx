export const generateAnswer = async (prompt: string) => {
    return fetch('/api/generate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            prompt,
        }),
    })
        .then((response) => {
            return response.json()
        })
        .catch((error) => {
            {
                console.log('error', error)
            }
        })
}
