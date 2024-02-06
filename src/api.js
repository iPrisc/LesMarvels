import crypto from 'crypto';

/**
 * Récupère les données de l'endpoint en utilisant les identifiants
 * particuliers developer.marvels.com
 * @param url l'end-point
 * @return {Promise<json>}
 */
export const getData = async (url) => {
    const publicKey = "14133da1d6de221028f7dc592c734233";
    const privateKey = "1110547705a0d58a5a4a3f5129900d9fc171e1ae";
    const ts = new Date().getTime();
    const hash = await getHash(publicKey, privateKey, ts);

    const url1 = url + "/v1/public/characters?ts=" + ts + "&apikey=" + publicKey + "&hash=" + hash;

    console.log("url: " + url1)

    const response = await fetch(url1);

    const data = await response.json();

    const characters = data.data.results.filter(result => {
        return result.thumbnail && result.thumbnail.path && !result.thumbnail.path.includes("image_not_available");
    }).map(result => {
        const thumbnailUrl = `${result.thumbnail.path}/portrait_xlarge.${result.thumbnail.extension}`;
        return { name: result.name, imageUrl: thumbnailUrl };
    });

    console.log(characters);

    return characters;
}

/**
 * Calcul la valeur md5 dans l'ordre : timestamp+privateKey+publicKey
 * cf documentation developer.marvels.com
 * @param publicKey
 * @param privateKey
 * @param timestamp
 * @return {Promise<ArrayBuffer>} en hexadecimal
 */
export const getHash = async (publicKey, privateKey, timestamp) => {
    const hash = crypto.createHash('md5').update(timestamp + privateKey + publicKey).digest('hex');
    return hash;
}