import React, { HtmlHTMLAttributes, useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';

import { Grid, IconButton, ListSubheader } from '@material-ui/core';
import { Add, Remove } from '@material-ui/icons';
import Container from '@material-ui/core/Container';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    lists: {
      textAlign: 'center',
      maxHeight: 480,
      overflow: 'auto',
    },
    spellText: {
      // textAlign: 'inherit'
    }
  }),
);

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

type classSpell = {
  "index": string;
  "name": string;
  "url": string;
}

type spell = {
  "index": string;
  "name": string;
  "desc": string[];
  "range": string;
  "components": string[];
  "ritual": boolean;
  "duration": string;
  "concentration": boolean;
  "casting_time": string;
  "level": number;
}


const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to Spellbook</h1>
        <h2>Let's look at some D&D 5e stuff</h2>
      </header>
      <Spellbook/>
    </div>
  );
}


const Spellbook = () => {
  const [dataJson, setDataJson] = useState('No Data Retrieved');
  // TODO: Make spell type
  const [spells, setSpells] = useState<any>([]);
  const [playerClass, setPlayerClass] = useState('all');
  const [level, setLevel] = useState(1);
  const [spellMod, setSpellMod] = useState(0);
  const [spellCast, setSpellCast] = useState<spellCastingData>();
  const [selected, setSelected] = useState('');
  const [spellDetails, setSpellDetails] = useState<spell>();

  // Class and Spell-list data
  useEffect(() => {
    fetchSpells(playerClass).then((spellData) => {
      setDataJson(JSON.stringify(spellData) || '');
      // setSpells(addSlotLvls(spellData.data.results));
      setSpells(spellData.data.results);
    });
    if (playerClass !== 'all') {
      fetchSpellCast(level, playerClass).then((castData) => {
        setDataJson(JSON.stringify(castData) || '');
        setSpellCast(castData.data.spellcasting);
      })
    } else {
      setSpellCast(undefined);
    }
  }, [playerClass, level])

  // Spell details data
  useEffect(() => {
    fetchDetails(selected).then((detailsData) => {
      setSpellDetails(detailsData.data)
    })
  }, [selected, spellDetails])

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

  const spellModUp = () => {
    if (spellMod < 5) {
      setSpellMod(spellMod + 1);
    }
  }

  const spellModDown = () => {
    if (spellMod > -5) {
      setSpellMod(spellMod - 1);
    }
  }

  const onChangePlayerClass = (e: any) => {
    const newPC = e.target.value;
    setPlayerClass(newPC)
  }

  const handleListItemClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    spellIndex: string
  ) => {
    setSelected(spellIndex);
  }
  

  const classes = useStyles();

  return (
      <Container className={classes.root}>
      {/* Container represents a max width for our page and adds padding on the left an right */}
      {/* can set maxWidth attr in a material ui <Containter> tag */}
        <Grid container>
          <Grid item xs={12} sm={4}>
            <h3>Settings</h3>
            <List className={classes.lists}>

            <div className="level_manager">
              <h4>Level:</h4>
              <Grid container direction='row' spacing={1} justify='center' alignItems='center'>
                <Grid item xs={2}>
                  <IconButton size='small' onClick={levelDown}>
                    <Remove />
                  </IconButton>
                </Grid>
                <Grid item xs={2}>
                  <p>{level}</p>
                </Grid>
                <Grid item xs={2}>
                  <IconButton size='small' onClick={levelUp}>
                    <Add />
                  </IconButton>
                </Grid>
              </Grid>
            </div>
            <div className="spell_abl_manager">
              <h4>Spell Ability Mod:</h4>
              <Grid container direction='row' spacing={1} justify='center' alignItems='center'>
                <Grid item xs={2}>
                  <IconButton size='small' onClick={spellModDown}>
                    <Remove />
                  </IconButton>
                </Grid>
                <Grid item xs={2}>
                  <p>{spellMod}</p>
                </Grid>
                <Grid item xs={2}>
                  <IconButton size='small' onClick={spellModUp}>
                    <Add />
                  </IconButton>
                </Grid>
              </Grid>
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
            <div className="castingData">
              <h3>Casting Information</h3>
              <p>cantrips: {spellCast?.cantrips_known}</p>
              <p>spells known: {spellCast?.spells_known}</p>
              <h4>Spell Slots</h4>
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
            </List>
          </Grid>

          <Grid item xs={12} sm={4}>
            <h3>Spells</h3>
            <List className={classes.lists}>
            {
              <ul>
                {spells.map((spell: any,) => {
                  return ( 
                    <ListItem 
                    button
                    selected={selected === spell.index}
                    onClick={(event) => handleListItemClick(event, spell.index)}>
                      <ListItemText primary={`${spell.name}`}/>
                    </ListItem>
                  );
                })}
              </ul>
            }
            </List>
            {/* <pre style={{textAlign:"left"}}>{dataJson}</pre> */}
          </Grid>

          <Grid item xs={12} sm={4}>
            <h3>Details</h3>
            <List className={classes.lists}>
            {
              (spellDetails)
              ? 
                <div style={{padding: '10px'}}>
                  <h4>{spellDetails.name}</h4>
                  <p>Level: {spellDetails.level}</p>
                  <p>Casting Time: {spellDetails.casting_time}</p>
                  <p>Range: {spellDetails.range}</p>
                  <p>Components: {spellDetails.components}</p>
                  <br/>
                  <p>{spellDetails.desc}</p>
                </div>
              :
              <p>Details will show up here.</p>
            }
            </List>
          </Grid>
        </Grid>
        
        
      </Container>
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
const fetchDetails = (selectedSpell?:string):Promise<any> => {
  let detailsUrl = 'https://www.dnd5eapi.co/api/spells/acid-arrow'
  if (selectedSpell !== '') { detailsUrl = `https://www.dnd5eapi.co/api/spells/${selectedSpell}`}

  return axios.get(detailsUrl).then( res => {
    console.log(res);
    return res;
  }).catch(err => {
    console.error(err);
  })
}

export default App;