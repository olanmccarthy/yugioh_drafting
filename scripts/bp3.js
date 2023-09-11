const fs = require('fs');

const run = async () => {
    let output = {
        amountOfPacks: 3,
        raresPerPack: 3,
        commonsPerPack: 9,
        starfoilsPerPack: 3,
        starfoils: [],
        rares: [],
        commons: []
    }
    //create this from using https://db.ygoprodeck.com/api/v7/cardinfo.php?cardset=War%20of%20the%20Giants:%20Round%202
    const setData = fs.readFileSync('bp2_rough.json');
    const { data } = JSON.parse(setData);

    let copy = [...data];

    output.starfoils = copy.map(({ name, id, frameType}) => (
        {
            name,
            id,
            isExtra: frameType === 'xyz',
        }
    ));

    copy = [...data];

    output.rares = copy.filter((card) => {
        for (set of card.card_sets) {
            if (set.set_name === 'Battle Pack 3: Monster League' && set.set_rarity === 'Rare') {
                return true
            }
        }
        return false
    }).map(({ name, id }) => ({
        name,
        id,
        isExtra: false
    }));

    copy = [...data];

    output.commons = copy.filter((card) => {
        for (set of card.card_sets) {
            if (set.set_name === 'Battle Pack 3: Monster League' && set.set_rarity === 'Common') {
                return true
            }
        }
        return false;
    }).map(({ name, id }) => ({
        name,
        id,
        isExtra: false
    }));

    console.log(JSON.stringify(output));
}

run();