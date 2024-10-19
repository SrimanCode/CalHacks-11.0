// import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
function App() {
  return (
    <div className="flex h-screen flex-col items-center p-10 bg-slate-100">
      <h1 className="text-3xl text-blue-800 font-bold ">
        Pitch Analyzer Application
      </h1>

      <div className="mt-5 grid grid-cols-4 gap-4">
        <Button variant="outlined">Button 1</Button>
        <Button variant="outlined">Button 2</Button>
        <Button variant="outlined">Button 3</Button>
        <Button variant="outlined">Button 4</Button>
      </div>
    </div>
  );
}

export default App;
