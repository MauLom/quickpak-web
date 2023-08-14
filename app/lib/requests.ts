export async function getUsers() {
    const res = await fetch("https://clownfish-app-b2q4a.ondigitalocean.app/quickpak-node2/usersData")
    if (!res.ok) {
        throw new Error('Failed to fetch data')
    }

    return res.json()
}