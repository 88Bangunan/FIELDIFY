export const getFields = async() => {
    const response = await fetch(
      `https://69dc4e1d84f912a264038ab5.mockapi.io/api/v1/fields`,
    );

    // HTTP Failure Checking -> All HTTP Status except in 200 - 299 Range
    if(!response.ok) {
        const error = new Error("Gagal mendapatkan data via API")
        error.status = response.status
        throw error 
    }

    const data = await response.json()
    
    if(response.status === 204) return null

    return data
}