"use client"

import { useEffect, useState } from "react";
import AddLinkIcon from '@mui/icons-material/AddLink';
import BookmarkAddedOutlinedIcon from '@mui/icons-material/BookmarkAddedOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useHotkeys } from "react-hotkeys-hook";

export const Todo = () => {
    const [todo, setTodo] = useState([])
    const [newValue, setNewValue] = useState("")
    const [updateValue, setUpdateValue] = useState("")
    const [message, setMessage] = useState(false);
    const [searchItem, setSearchItem] = useState("");
    const sclear = () => {
        sessionStorage.removeItem('todo');
        setTodo("");
        getlocalData();
    }
    const ssave = () => {
        sessionStorage.setItem("todo", JSON.stringify(todo));
    }
    const getlocalData = () => {
        sessionStorage.getItem("todo") ?
            setTodo(JSON.parse(sessionStorage.getItem("todo", todo))) :
            localStorage.getItem("todo") &&
            setTodo(JSON.parse(localStorage.getItem("todo")))
    }
    const saveLocalStorage = () => {
        localStorage.setItem("todo", JSON.stringify(todo))
        setMessage("save");
        setTimeout(() => setMessage(false), 2000)
    }
    document.addEventListener("keydown", function (e) {
        if (e.keyCode === 83 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
            e.preventDefault();
        }
    }, false);

    useHotkeys('ctrl+s', () => saveLocalStorage())
    useEffect(() => {
        getlocalData();
    }, [])

    const Add = (index = todo?.length) => {
        console.log(newValue?.length)
        if (newValue?.length === 0 && updateValue?.length === 0) {
            setMessage("Error");
            setTimeout(() => setMessage(false), 2000)
            ssave();
        } else {
            if (newValue != "") {
                todo.splice(index, 1, newValue)
                setTodo([...todo])
                setNewValue("");
                ssave();
            }
            if (updateValue != "") {
                todo.splice(index, 1, updateValue)
                setTodo([...todo])
                setUpdateValue("");
                ssave();
            }
        }

    }
    const Edit = (index) => {
        todo.splice(index, 1, "")
        setTodo([...todo])
        ssave();
    }
    const Delete = (index) => {
        todo.splice(index, 1);
        setTodo([...todo])
        ssave();
    }

    const A2Z = () => {
        todo.sort((a, b) => 1 * a.localeCompare(b))
        setTodo([...todo])
        ssave();
    }
    const Z2A = () => {
        todo.sort((a, b) => -1 * a.localeCompare(b))
        setTodo([...todo])
        ssave();
    }

    const find = (e) => {
        if (e?.length === 0) {
            getlocalData();
        } else {
            if (e?.length === 1) {
                setTodo(
                    todo.filter(x => x.includes(e))
                )
            } else {
                setTodo(
                    todo.filter(x => x.toLowerCase().includes(e))
                )
            }
        }

        setSearchItem(e);
    }

    return (<>
        <button type="button" onClick={saveLocalStorage} class="btn btn-success m-1 position-fixed" ><BookmarkAddedOutlinedIcon /></button>
        <div class="input mt-5 p-1 position-fixed" >
            <button type="button" onClick={sclear} class="btn btn-danger m-1 " >Session Clear</button><br />
            <input type="text" value={newValue} onChange={(e) => setNewValue(e.target.value.trimStart())} placeholder="New Entry" autoFocus></input>
            < button onClick={() => Add()} type="button" class="btn btn-warning  m-1 ">
                Add New
            </button>
            <br />
            <input type="text" value={searchItem} onChange={(e) => find(e.target.value.trimStart())} placeholder="search" ></input>
            <br />
            <button onClick={A2Z} type="button" class="btn btn-primary  m-1 ">
                A-Z
            </button>
            <button onClick={Z2A} type="button" class="btn btn-secondary  m-1 ">
                Z-A
            </button>
            <br />
            Toral Find : {todo.length}
        </div>
        <center>
            {message &&
                (message === "save") ?
                <h1 style={{ color: "green", position: "fixed", left: "50%", top: "50%", transform: "translate(-50%,-50%)", opacity: "0.5" }}>Saved Successfully</h1> :
                (message === "Error") && <h3 style={{ color: "red", position: "fixed", left: "50%", top: "50%", transform: "translate(-50%,-50%)", opacity: "0.5" }}>Please Enter Input</h3>
            }
            {
                (todo?.length === 0) ?
                    <><h2>Sorry Data is Empaty</h2></> :
                    <>
                        <table className="table table-dark w-50 mt-2 table-striped">
                            <thead>
                                <tr>
                                    <th>s.no</th>
                                    <th>Name</th>
                                    <th>Operation</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    todo &&
                                    todo.map((item, id) => {
                                        return (
                                            <tr key={id}>
                                                <th>{id + 1}</th>
                                                <th>{
                                                    (item === "") ?
                                                        <input type="text" value={updateValue} onChange={(e) => setUpdateValue(e.target.value)} placeholder="New Entry" autoFocus></input>
                                                        : item
                                                }</th>
                                                <th>
                                                    {(item === "") ?
                                                        < button onClick={() => Add(id)} type="button" class="btn  m-1 ">
                                                            <AddLinkIcon style={{ color: "yellow", cursor: "pointer" }} />
                                                        </button>
                                                        : <>
                                                            <button onClick={() => Edit(id)} type="button" class="btn  m-1 ">
                                                                <EditIcon style={{ color: "lime", cursor: "pointer" }} />
                                                            </button>
                                                            <button onClick={() => Delete(id)} type="button" class="btn  m-1 ">
                                                                <DeleteIcon style={{ color: "red", cursor: "pointer" }} />
                                                            </button>
                                                        </>
                                                    }
                                                </th>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </>
            }
        </center >
    </>
    )
}
