import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';


// need to add more interfaces, we're in typescript, use the types
enum PlayerClass {
  Bard='bard',
  Cleric='cleric',
  Druid='druid',
  Paladin='paladin',
  Ranger='ranger',
  Warlock='warlock',
  Wizard='wizard'
}

type spellCastingData = {
  "cantrips_known": number;
  "spells_known": number;
  "spell_slots_level_1": number;
  "spell_slots_level_2": number;
  "spell_slots_level_3": number;
  "spell_slots_level_4": number;
  "spell_slots_level_5": number;
  "spell_slots_level_6": number;
  "spell_slots_level_7": number;
  "spell_slots_level_8": number;
  "spell_slots_level_9": number;
}


const App = () => {
  return (
    <div className="App">
      <h1>Welcome to Spellbook</h1>
      <h2>Let's look at some D&D 5e stuff</h2>
      <Spellbook/>
    </div>
  );
}


// Note make a spell type
const getSpellName = (spell: any) => {
  return `${spell.name}`;
}

const Spellbook = () => {
  const [dataJson, setDataJson] = useState('No Data Retrieved');
  const [spells, setSpells] = useState<any>([]);
  const [playerClass, setPlayerClass] = useState('all');
  const [level, setLevel] = useState(1);
  const [spellCast, setSpellCast] = useState<spellCastingData>();

  useEffect(() => {
    fetchSpells(playerClass).then((spellData) => {
      setDataJson(JSON.stringify(spellData) || '');
      setSpells(spellData.data.results);
    });
    if (playerClass !== 'all') {
      fetchSpellCast(level, playerClass).then((castData) => {
        setDataJson(JSON.stringify(castData) || '');
        setSpellCast(castData.data.spellcasting);
      });
    } else {
      setSpellCast(undefined);
    }
  }, [playerClass, level])

  const levelUp = () => {
    if (level < 20) {
      setLevel(level + 1);
    }
  };

  const levelDown = () => {
    if (level > 1) {
      setLevel(level - 1);
    }
  };

  const onChangePlayerClass = (e: any) => {
    const newPC = e.target.value;
    setPlayerClass(newPC)
  }
  

  return (
    <div>
      <div className="level_manager">
        <button onClick={levelUp}>+</button>
        <p>Level: {level}</p>
        <button onClick={levelDown}>-</button>
      </div>
      <div className='player_class_select'>
        <select onChange={onChangePlayerClass}>
          <option key="all" value="all">ALL</option>
          {Object.values(PlayerClass).map(pc => {
            return (
              <option key={pc} value={pc}> {pc.toUpperCase()} </option>
            )
          })}
        </select>
      </div>
      <div className="casting_data">
        <p>cantrips: {spellCast?.cantrips_known}</p>
        <p>spells known: {spellCast?.spells_known}</p>
        <p>1st level: {spellCast?.spell_slots_level_1}</p>
        <p>2nd level: {spellCast?.spell_slots_level_2}</p>
        <p>3rd level: {spellCast?.spell_slots_level_3}</p>
        <p>4th level: {spellCast?.spell_slots_level_4}</p>
        <p>5th level: {spellCast?.spell_slots_level_5}</p>
        <p>6th level: {spellCast?.spell_slots_level_6}</p>
        <p>7th level: {spellCast?.spell_slots_level_7}</p>
        <p>8th level: {spellCast?.spell_slots_level_8}</p>
        <p>9th level: {spellCast?.spell_slots_level_9}</p>
      </div>
      {
        spells.map((spell: any, index: number) => {
          return <p key={index}>{getSpellName(spell)}</p>;
        })
      }
      <pre style={{textAlign:"left"}}>{dataJson}</pre>
    </div>
  );
}


const fetchSpellCast = (level:number, playerClass:string):Promise<any> => {
  return axios.get(`https://www.dnd5eapi.co/api/classes/${playerClass}/levels/${level}`).then( res => {
    console.log(res);
    return res;
  }).catch(err => {
    console.error(err)
  })
}

const fetchSpells = (playerClass?:string):Promise<any> => {
  let spellUrl = 'https://www.dnd5eapi.co/api/spells'
  if (playerClass !== 'all') { spellUrl = `https://www.dnd5eapi.co/api/classes/${playerClass}/spells` }

  return axios.get(spellUrl).then( res => {
    console.log(res);
    return res;
  }).catch(err => {
    console.error(err);
  })
}


export default App;
