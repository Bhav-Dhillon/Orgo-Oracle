// @ts-nocheck
import { useState } from 'react';
import ChemLib from './lib/ChemDoodleWeb.js';
import logoImg from './assets/logoImg.png';

function App() {
  const [searchText, setSearchText] = useState({
    search: "",
  })
  // console.log(searchText.textBox);


  function handleSearchClick(){

    const searchEl = document.querySelector(".search-box");
    searchEl?.classList.add("border-searching");
    const si = document.querySelector(".search-icon");
    si?.classList.add("si-rotate")
  }

  function handleSearchReset(){
    const searchEl = document.querySelector(".search-box");
    searchEl?.classList.remove("border-searching");
    const si = document.querySelector(".search-icon");
    si?.classList.remove("si-rotate");
  }

  function handleGo(){
    const goIcon = document.querySelector(".go-icon")
    if (searchText.search.length > 0) {
      goIcon?.classList.add("go-in")
		} else {
      goIcon?.classList.remove("go-in")
		}
  }

  function handleText(event){
    const { name, value } = event.target
    setSearchText(prevText => ({ ...prevText, [name]: value }))
  }




  let reader3d = new FileReader();
  let reader2d = new FileReader();

  let molecule3d;
  let molecule2d;
  let size;

  const mediaQuery = window.matchMedia('(min-width: 480px)')


  if(mediaQuery.matches){
    size = 350; 
  }
  else size = 320;


  


  function Display2D(_2Dmolecule){
    let display2D = new ChemLib.TransformCanvas('display2D', size, size, true);
    display2D.styles.atoms_HBlack_2D = false;
    display2D.styles.atoms_color = 'white';
    display2D.styles.bonds_color = "white";
    display2D.styles.atoms_font_size_2D = 8;
    display2D.styles.atoms_displayTerminalCarbonLabels_2D = true;
    display2D.styles.backgroundColor = '#259872';
    let mol = ChemLib.readMOL(_2Dmolecule);
    display2D.loadMolecule(mol);
    // rotate2D.styles.atoms_font_bold_2D = true;
  }
  
  function Display3D(_3Dmolecule){
    let display3D = new ChemLib.TransformCanvas('display3D', size, size, true);
    display3D.styles.atoms_circles_2D = true;
    display3D.styles.atoms_useJMOLColors = true;
    display3D.styles.atoms_HBlack_2D = false;
    display3D.styles.bonds_symmetrical_2D = true;
    display3D.styles.backgroundColor = '#259872';
    display3D.dragPath = [];
    display3D.oldDrag = display3D.drag;
    display3D.drag = function(e){
      this.dragPath[display3D.dragPath.length] = e.p;
      this.oldDrag(e);
    }
    let mol = ChemLib.readMOL(_3Dmolecule);
    display3D.loadMolecule(mol);
  }

  function BallAndStick(){
    let transformBallAndStick = new ChemLib.TransformCanvas3D('transformBallAndStick', 300, 300);
    transformBallAndStick.styles.set3DRepresentation('Ball and Stick');
    transformBallAndStick.styles.backgroundColor = 'white';
    transformBallAndStick.styles.atoms_sphereDiameter_3D = 8;
    transformBallAndStick.styles.atoms_displayLabels_3D = true; 
    transformBallAndStick.styles.atoms_useVDWDiameters_3D = false; 
    transformBallAndStick.styles.bonds_cylinderDiameter_3D = 2; 
    transformBallAndStick.styles.atoms_useJMOLColors = true;
    transformBallAndStick.styles.backgroundColor = 'black';

    transformBallAndStick.styles.atoms_circles_2D = true;
    transformBallAndStick.styles.atoms_HBlack_2D = false;
    transformBallAndStick.styles.bonds_symmetrical_2D = true;


    ChemLib.io.file.content('/molecules/asprin.mol', function(fileContent) {
      let mol2 = ChemLib.readMOL(fileContent);
      transformBallAndStick.loadMolecule(mol2);
    });
  }



  function handleSearch(searchedString){
    fetch(`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${searchedString}/SDF?record_type=3d`)
      .then(res => { return res.blob() })
      .then(data => {
        reader3d.readAsText(data);
        reader3d.onload = function() {
          molecule3d = reader3d.result;
          // console.log(molecule);
          Display3D(molecule3d);
        };
      })

    fetch(`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${searchedString}/SDF?record_type=2d`)
      .then(res => { return res.blob() })
      .then(data => {
        reader2d.readAsText(data);
        reader2d.onload = function() {
          molecule2d = reader2d.result;
          // console.log(molecule);
          Display2D(molecule2d);
        };
      })
  }

  return (
    <div className="App">
      <header className='header--wrapper'>
        <div className='logoImg--wrapper'>
          <img className='logoImg' src={logoImg}/>
        </div>
        {/* <h1 className='logoName'>Orgo Oracle</h1> */}

        <div className="container">
          <div className="search-box">
            <div className="search-icon"><i className="fa fa-search search-icon"></i></div>
            <form action="" className="search-form">
              <input 
                type="text" 
                value={searchText.search}
                name="search"
                placeholder="Search" 
                id="search" 
                autoComplete="off"
                onFocus={() => handleSearchClick()}
                onBlur={() => handleSearchReset()}
                onKeyUp={() => handleGo()}
                onChange={handleText} />
            </form>
            <svg className="search-border" enableBackground="new 0 0 671 111" version="1.1" viewBox="0 0 671 111" xmlSpace="preserve" xmlns="http://www.w3.org/2000/svg">
              <path className="border" d="m335.5 108.5h-280c-29.3 0-53-23.7-53-53s23.7-53 53-53h280"/>
              <path className="border" d="m335.5 108.5h280c29.3 0 53-23.7 53-53s-23.7-53-53-53h-280"/>
            </svg>
            <div className="go-icon"><i className="fa fa-arrow-right" onClick={() => { handleSearch(searchText.search) }}></i></div>
          </div>
        </div>
      </header>




      <div className='main--wrapper'>

        {/* <div className='search--wrapper'>
          <input
            type="text"
            placeholder="Search for a compound..."
            className="search--input"
            name="textBox"
            onChange={handleText}
            value={searchText.textBox}
            />
                
          <button className='searchBtn' onClick={() => { handleSearch(searchText.textBox) }}>
              Search
          </button>
        </div> */}


        <div className='search--and--canvas--wrapper'>
          <canvas id='display2D'>
          </canvas>
          <canvas id='display3D'>
          </canvas>      
        </div>

        <div className='table--wrapper'>
          <div className='table'></div>
        </div>

      </div>
    </div>
  )
}

export default App
