import { BrowserRouter, Route, Routes } from "react-router-dom";
import Newtask from "./component/Newtask";

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <BrowserRouter>
        <Routes>
          <Route path="/new" element={<Newtask />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
