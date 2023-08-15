export async function getUsers() {
    const res = await fetch("https://clownfish-app-b2q4a.ondigitalocean.app/quickpak-node2/usersData")
    if (!res.ok) {
        throw new Error('Failed to fetch data')
    }
    return res.json()
}

export async function getQuotes(quotesData: any) {
    const bodyUnParsed: any = quotesData
    let bodyEstafeta = {
        "alto": bodyUnParsed?.package[0]?.height,
        "ancho": bodyUnParsed?.package[0]?.width,
        "esPaquete": true,
        "largo": bodyUnParsed?.package[0]?.length,
        "peso": bodyUnParsed?.package[0]?.weight,
        "originZip": bodyUnParsed?.data?.originZip,
        "destinyZip": bodyUnParsed?.data?.destinyZip,
        "userId": bodyUnParsed?.userId
    }

    const res = await fetch("https://clownfish-app-b2q4a.ondigitalocean.app/quickpak-node2/getRates/estafeta", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyEstafeta),
    })
    if (!res.ok) {
        throw new Error('Failed to fetch data')
    }

    return res.json()
}