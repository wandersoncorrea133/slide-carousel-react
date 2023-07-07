import {Carousel} from "./Carousel"
import './App.css'


function App() {
  
  return (
    <div className="App">
      <Carousel>
        <img src="https://picsum.photos/id/237/200/300" alt="01" style={{width: "100%", height: "100%"}} />
        <img src="https://picsum.photos/seed/picsum/200/300" alt="02" style={{width: "100%", height: "100%"}} />
        <img src="https://picsum.photos/200/300" alt="03" style={{width: "100%", height: "100%"}} />
        <img src="https://picsum.photos/200/300/" alt="04" style={{width: "100%", height: "100%"}} />
      </Carousel>
    </div>
  )
}

export default App
