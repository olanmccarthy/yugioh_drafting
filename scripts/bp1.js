const BP1rares = ['Witch of the Black Forest', 'Cyber Jar', 'Jinzo', 'Injection Fairy Lily', 'Dark Dust Spirit', 'Skull Archfiend of Lightning', 'Dark Magician of Chaos', 'Blowback Dragon', 'Mobius the Frost Monarch', 'Fox Fire', 'Ancient Gear Golem', 'Treeborn Frog', 'Super Conductor Tyranno', 'Gorz the Emissary of Darkness', 'Raiza the Storm Monarch', 'White Night Dragon', 'Deep Diver', 'Caius the Shadow Monarch', 'Krebons', 'Tragoedia', 'Obelisk the Tormentor', 'Machina Fortress', 'Tour Guide From the Underworld', 'Number 39: Utopia', 'Gachi Gachi Gantetsu', 'Grenosaurus', 'Number 17: Leviathan Dragon', 'Wind-Up Zenmaister', 'Tiras, Keeper of Genesis', 'Adreus, Keeper of Armageddon', 'Gem-Knight Pearl', 'Raigeki', 'Swords of Revealing Light', 'Pot of Greed', "Harpie's Feather Duster", 'Graceful Charity', 'Change of Heart', 'Heavy Storm', 'Snatch Steal', 'Premature Burial', 'Soul Exchange', 'Scapegoat', 'United We Stand', 'Creature Swap', 'Burden of the Mighty', 'Pot of Duality', 'Solemn Judgment', 'Mirror Force', 'Call of the Haunted', 'Ring of Destruction', 'Torrential Tribute', 'Metal Reflect Slime', 'Skill Drain', 'Divine Wrath', 'Dark Bribe'];
const BP1commons = ['Greenkappa', 'Penguin Soldier', 'Mysterious Guard', 'Exiled Force', 'Old Vindictive Magician', 'Breaker the Magical Warrior', 'Grave Squirmer', 'Ryko, Lightsworn Hunter', 'Snowman Eater', 'Fissure', 'Tribute to The Doomed', 'Axe of Despair', 'Mystical Space Typhoon', 'Horn of the Unicorn', 'Offerings to the Doomed', 'Bait Doll', 'Book of Moon', 'Autonomous Action Unit', 'Ante', 'Big Bang Shot', "Fiend's Sanctuary", 'Different Dimension Gate', 'Enemy Controller', 'Monster Gate', 'Shield Crush', 'Fighting Spirit', 'Forbidden Chalice', 'Darkworld Shackles', 'Forbidden Lance', 'Infected Mail', 'Ego Boost', 'Kunai with Chain', 'Dust Tornado', 'Windstorm of Etaqua', 'Magic Drain', 'Magic Cylinder', 'Shadow Spell', 'Blast with Chain', 'Needle Ceiling', 'Reckless Greed', 'Nightmare Wheel', 'Spell Shield Type-8', 'Interdimensional Matter Transporter', 'Compulsory Evacuation Device', 'Prideful Roar', 'Half or Nothing', 'Skill Successor', 'Pixie Ring', 'Changing Destiny', 'Fiendish Chain', 'Inverse Universe', "Miracle's Wake", 'Power Frame', 'Damage Gate', 'Liberty at Last!', 'Luster Dragon', 'Archfiend Soldier', 'Mad Dog of Darkness', 'Charcoal Inpachi', 'Insect Knight', 'Gene-Warped Warwolf', 'Buster Blader', 'Goblin Attack Force', 'Bazoo the Soul-Eater', 'Zombyra the Dark', 'Slate Warrior', 'Dark Ruler Ha Des', 'Freed the Matchless General', 'Airknight Parshath', 'Asura Priest', 'Exarion Universe', 'Vampire Lord', 'Toon Gemini Elf', 'King Tiger Wanghu', 'Guardian Sphinx', 'Skilled White Magician', 'Zaborg the Thunder Monarch', 'D.D. Assailant', 'Theban Nightmare', 'The Tricky', 'Raging Flame Sprite', 'Chiron the Mage', 'Cyber Dragon', 'Cybernetic Magician', 'Goblin Elite Attack Force', 'Doomcaliber Knight', 'Chainsaw Insect', 'Card Trooper', 'Voltic Kong', 'Botanical Lion', 'Ancient Gear Knight', 'Blizzard Dragon', 'Beast King Barbaros', 'The Calculator', 'Gaap the Divine Soldier', 'Arcana Force XIV - Temperance', 'Dark Valkyria', 'Alector, Sovereign of Birds', 'Twin-Barrel Dragon', 'Abyssal Kingshark', 'Jurrac Protops', 'Hedge Guard', 'Fabled Ashenveil', 'Backup Warrior', 'Ambitious Gofer', 'Power Giant', 'Card Guard', 'Yaksha', 'Gogogo Golem', 'Big Jaws', 'Wind-Up Soldier', 'Wind-Up Dog', 'Milla the Temporal Magician', 'Ape Fighter', 'Wind-Up Warrior', 'Giant Soldier of Stone', 'Mask of Darkness', 'Morphing Jar', 'Muka Muka', 'Blast Sphere', 'Big Shield Gardna', 'Gilasaurus', 'Possessed Dark Soul', 'Twin-Headed Behemoth', 'Makyura the Destructor', 'Helping Robo for Combat', 'Zolga', 'Chaos Necromancer', 'Stealth Bird', 'Hyper Hammerhead', 'Grave Protector', 'Night Assailant', 'Pitch-Black Warwolf', 'Dekoichi the Battlechanted Locomotive', 'Gyroid', 'Drillroid', 'Gravitic Orb', 'Cloudian - Poison Cloud', 'Des Mosquito', 'Mad Reloader', 'Phantom of Chaos', 'Cyber Valley', 'Blue Thunder T-45', 'Vortex Trooper', 'DUCKER Mobile Cannon', 'Worm Barses', 'Shield Warrior', 'Dark Resonator', 'Noisy Gnat', 'Fabled Raven', 'Fortress Warrior', 'Twin-Sword Marauder', 'Level Warrior', 'Level Eater', 'Naturia Strawberry', 'Battle Fader', 'Amazoness Sage', 'Amazoness Trainee', 'Hardened Armed Dragon', 'Blackwing - Zephyros the Elite', 'Tanngrisnir of the Nordic Beasts', 'Shine Knight', 'Gagaga Magician', 'Goblindbergh', 'Psi-Blocker'];
const request = require('superagent');
const fs = require('fs');

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
  }

const run = async () => {
    let output =  {
        amountOfPacks: 5,
        raresPerPack: 2,
        commonsPerPack: 6,
        starfoilsPerPack: 2,
        starfoils: [],
        rares: [],
        commons: []
    }
    
    for (let rare in BP1rares) {
        let data = await request.get(`https://db.ygoprodeck.com/api/v7/cardinfo.php?name=${encodeURIComponent(BP1rares[rare])}`)
        console.log(data.body.data[0].id);
        output.rares.push({
            name: BP1rares[rare],
            id: data.body.data[0].id
        });
        await delay(100);
    }

    for (let common in BP1commons) {
        let data = await request.get(`https://db.ygoprodeck.com/api/v7/cardinfo.php?name=${encodeURIComponent(BP1commons[common])}`)
        output.commons.push({
            name: BP1commons[common],
            id: data.body.data[0].id
        });
        await delay(100);
    }

    output.starfoils = [...output.rares, ...output.commons]

    const json = JSON.stringify(output);
    fs.writeFileSync('BP1.json', json, 'utf8')
}

run()