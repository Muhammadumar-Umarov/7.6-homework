import { Link, Route, Routes } from "react-router-dom"
import Home from "./pages/home/Home"

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home/>}/>
        {/* <Route path="/about" element={<About/>}/> */}
      </Routes>
    </div>
  )
}

export default App