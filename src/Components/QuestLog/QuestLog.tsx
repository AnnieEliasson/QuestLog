//Börja med att quests har id, beskrivning och en flagga för avklarad.
//Vi ska ha ett antal ofärdiga quests när vi startar appen.
//Man ska kunna toggla ett quest att vara avklarat eller inte. Det kan vara
//checkboxar man klickar i och ur, eller någon annan design.

import data from "./startquests.json";
import { useReducer, useState } from "react";
import "./QuestLog.scss";

const ACTIONS = {
    ADD: 'add',
    TOGGLE: 'toggle',
    CLEAR: 'clear',
    EDIT: 'edit',
    SAVEEDIT: 'saveEdit',
}

type Quest = {
    id: number;
    description: string;
    complete: boolean;
}

type Action = {
    type: string;
    payload?: any;
}

const startQuests: Quest[] = data.startquests

const reduce = (quests: Quest[], action: Action): Quest[] => {
    switch (action.type) {

        case ACTIONS.ADD:
            return [...quests, {id: Date.now(), description: action.payload.text, complete: false}]

        case ACTIONS.TOGGLE:
            return quests.map((q)=>{
                if(q.id === action.payload.id){
                    return {...q, complete: !q.complete}
                }

                return q
            })

        case ACTIONS.EDIT: 
            console.log(action.payload.text);
            return quests.map((q)=>{

                if (q.id === action.payload.id){
                    return {...q}
                }

                return q

            })

        case ACTIONS.SAVEEDIT:
            return quests.map((q)=>{

                if (q.id === action.payload.id){
                    return {...q, description: action.payload.text}
                }

                return q
            })
            
        case ACTIONS.CLEAR:
            return quests.filter(q => q.complete === false)
    
        default:
            return quests
    }
}



function QuestLog() {

    const editBox = document.querySelector(".edit-box") as HTMLElement

    const [quests, dispatch] = useReducer(reduce, [...startQuests])
    const [text, setText] = useState('')
    const [edit, setEdit] = useState('')
    const [editID, setEditID] = useState(0)

    const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault()
        dispatch({type: ACTIONS.ADD, payload: {text: text}})
        setText('')  
    }

    const handleClickEdit = (q: Quest) => {

        editBox.classList.add("show")
        dispatch({type: ACTIONS.EDIT, payload: {id: q.id, text: q.description}})
        setEdit(q.description)
        setEditID(q.id)
    }

    const saveEdit = () => {

        editBox.classList.remove("show")
        dispatch({type: ACTIONS.SAVEEDIT, payload: {id: editID, text: edit}})
        
    }

  return (
    <div className="QuestLog">
        <h1>Questlog</h1>

        <ul>
            {
                quests.map((q)=>{
                    return <li key={q.id}>🗡 <span onClick={()=>{dispatch({type: ACTIONS.TOGGLE, payload: {id : q.id}})}}>{q.description}</span> <span className="edit" onClick={()=>handleClickEdit(q)}>✎</span> {q.complete? <span className="check">✓</span>: ''}</li>
                })
            }
        </ul>
        
        <button className="clear" onClick={()=> dispatch({
            type: ACTIONS.CLEAR
        })}>Clear Completed</button>

        <div className="edit-box">
        <input value={edit} onChange={(e)=> setEdit(e.target.value)} className="edit" type="text" />
        <button className="save-edit" onClick={()=> saveEdit()} >⏎</button>
        </div>

        <form onSubmit={handleSubmit}>
        <input className="input" value={text} onChange={(e) => setText(e.target.value)} placeholder="Add new Quest here!" type="text" />
        </form>

    </div>
  )
}

export default QuestLog