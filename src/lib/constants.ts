export const API_BASE_URL = "https://exact-trivially-kangaroo.ngrok-free.app"

export function apiFetch(input: string, init?: RequestInit): Promise<Response> {
    return fetch(input, {
        ...init,
        headers: {
            "ngrok-skip-browser-warning": "1",
            ...init?.headers,
        },
    })
}
