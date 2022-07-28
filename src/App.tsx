// @ts-nocheck
import { useState } from 'react';
import ChemLib from './lib/ChemDoodleWeb.js';
import logoImg from './assets/logoImg.png';

function App() {
  const [searchText, setSearchText] = useState({
    textBox: "",
  })
  console.log(searchText.textBox);
  let reader3d = new FileReader();
  let reader2d = new FileReader();

  let molecule3d;
  let molecule2d;


  function Display2D(_2Dmolecule){
    let display2D = new ChemLib.TransformCanvas('display2D', 250, 250, true);
    display2D.styles.atoms_HBlack_2D = false;
    display2D.styles.atoms_color = 'white'
    display2D.styles.bonds_color = "white"
    display2D.styles.atoms_font_size_2D = 8;
    // display2D.styles.bondLength_2D = 40;
    display2D.styles.atoms_displayTerminalCarbonLabels_2D = true;
    display2D.styles.backgroundColor = '#259872';
    let mol = ChemLib.readMOL(_2Dmolecule);
    display2D.loadMolecule(mol);
    // rotate2D.styles.atoms_font_bold_2D = true;
  }
  
  function Display3D(_3Dmolecule){
    let display3D = new ChemLib.TransformCanvas('display3D', 300, 300, true);
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

  function handleText(event){
      const { name, value } = event.target
      setSearchText(prevText => ({ ...prevText, [name]: value }))
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
        <h1 className='logoName'>Orgo Oracle</h1>
      </header>




      <div className='main--wrapper'>
        <div className='search--wrapper'>
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
        </div>
        <canvas id='display2D'>
        </canvas>
        <canvas id='display3D'>
        </canvas>      

      </div>
    </div>
  )
}

export default App
