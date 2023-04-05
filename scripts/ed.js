const fs = require('fs');
const request = require('superagent');

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}
const run = async () => {
    let rawdata = fs.readFileSync('./sets/BP1.json');
    let cards = JSON.parse(rawdata);

    for (let rare in cards.rares) {
        let data = await request.get(`https://db.ygoprodeck.com/api/v7/cardinfo.php?name=${encodeURIComponent(cards.rares[rare].name)}`)
        if (data.body.data[0].type === 'XYZ Monster') {
            cards.rares[rare] = { ...cards.rares[rare], isExtra: true}
        } else {
            cards.rares[rare] = { ...cards.rares[rare], isExtra: false}
        }
        await delay(100);
    }

    for (let common in cards.commons) {
        let data = await request.get(`https://db.ygoprodeck.com/api/v7/cardinfo.php?name=${encodeURIComponent(cards.commons[common].name)}`)
        if (data.body.data[0].type === 'XYZ Monster') {
            cards.commons[common] = { ...cards.commons[common], isExtra: true}
        } else {
            cards.commons[common] = { ...cards.commons[common], isExtra: false}
        }
        await delay(100);
    }

    for (let card in cards.starfoils) {
        let data = await request.get(`https://db.ygoprodeck.com/api/v7/cardinfo.php?name=${encodeURIComponent(cards.starfoils[card].name)}`)
        if (data.body.data[0].type === 'XYZ Monster') {
            cards.starfoils[card] = { ...cards.starfoils[card], isExtra: true}
        } else {
            cards.starfoils[card] = { ...cards.starfoils[card], isExtra: false}
        }
        await delay(100);
    }

    const json = JSON.stringify(cards);
    fs.writeFileSync('BP1.json', json, 'utf8')
}

run()