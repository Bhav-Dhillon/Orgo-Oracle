// @ts-nocheck
import { useState, useEffect } from 'react';

export default function Search() {
    const [searchText, setSearchText] = useState({
        textBox: "",
    })

    function handleText(event)
    {
        const { name, value } = event.target
        setSearchText(prevText => ({ ...prevText, [name]: value }))
    }

    console.log(searchText.textBox);

    // https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/aspirin/SDF

    // React.useEffect(function () 
    // {
    //     fetch("https://api.imgflip.com/get_memes")
    //         .then(res => res.json())
    //         .then(data => setAllMemeImages(data.data.memes))
    // }, [])

    function handleSearch(a){
        fetch(`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${searchText.textBox}/SDF?record_type=3d`)
        .then((res) => { return res.blob(); })
        .then((data) => {
            console.log(data);
        // var a = document.createElement("a");
        // a.href = window.URL.createObjectURL(data);
        // a.download = "asprin";
        // a.click();
        })
            // .then(res => console.log(res))
            // .then(data => console.log(data))
    }

    fetch('https://cactus.nci.nih.gov/chemical/structure/aspirin/file?format=sdf')
        .then(res => res.toString())

    return (
        <>
            <input
            type="text"
            placeholder="Search for a compound"
            className="form--input"
            name="textBox"
            onChange={handleText}
            value={searchText.textBox}
            />
            <button onClick={() => handleSearch(searchText.textBox)}>Search!</button>
        </>

    )
}