//Dashboard : Select sheet to display its columnCount

import {React, useEffect, useState} from "react"
import { decodeToken } from "react-jwt";
import { useNavigate } from 'react-router-dom'
import "./styles.css"


const Dashboard = () => {

    //Used to navigate to a different path
    const navigate = useNavigate()  

    //Column Count of the google sheet selected
    const [columnCount, setColumnCount] = useState("You have to select a sheet to get its column count....duh")

    //ID of the sheet selected
    const [sheetID, setSheetID] = useState("")

    //SheetIDs of the googleID selected
    const [sheetIDs, setSheetIDs] = useState([""])

    //GoogleID selected
    const [googleID, setGoogleID] = useState('')

    //function to retrieve all IDs of the spreadsheets in the user's googleID
    async function populateSheetIDs() {
        const req = await fetch('http://localhost:1337/api/sheetIDS', {
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        })

        const data = await req.json()

        if(data.status === 'ok') {
            setSheetIDs(data.sheetIDs)
        } else {
            alert(data.error)
        }
    }

    //function to retrieve the user's googleID
    async function populateGoogleID() {
        const req =await fetch('http://localhost:1337/api/googleID', {
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        })

        const data = await req.json()

        if(data.status === 'ok') {
            setGoogleID(data.googleID)
        } else {
            alert(data.error)
        }
    }

    
    useEffect(() => {
        const token = localStorage.getItem('token')
        if (token) {
            const user = decodeToken(token)
            if (!user) {
                localStorage.removeItem('token')
                navigate.replaceState('/login')
            } else {
                populateGoogleID()
                populateSheetIDs()
            }
        }
    })

    //function to set the value of the prop sheetID to the selected sheetID
    async function handleChange(event) {
        setSheetID(event.target.value)
    }

    //function to retrieve columnCount and set it to the prop columnCount
    async function handleSubmit(event) {
        event.preventDefault()
        console.log(sheetID)
        const req = await fetch('http://localhost:1337/api/columnCount', {
            method: 'POST',
            headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': localStorage.getItem('token')
            },

            body: JSON.stringify({
                id: sheetID
            })
        })

        const data = await req.json()
        console.log(data)
        if(data.status === "ok") {
            setColumnCount(data.columnCount)
        }
    }

    return (
            <div>
                <h1> Your Google email id: {googleID || "No ID Found"} </h1>
                <form onSubmit={handleSubmit}>
                    <label>
                        Choose your sheet:
                        <select value={sheetID} onChange={handleChange}>
                            {sheetIDs.map((sheetId, i) => (
                                <option key={i} value={sheetId}> {sheetId} </option>
                            ))}
                        </select>
                    </label>
                    <input type="submit" value="Submit SheetID" />
                </form>

                <h1> The column count of your sheet is : {columnCount} </h1>
            </div>
        )
}

export default Dashboard;

