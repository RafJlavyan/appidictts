import MyRoutes from "./routes/MyRoutes"
import { Toaster } from "react-hot-toast";

function App() {

  return (
    <>
    <MyRoutes/>
    <Toaster position="top-center" toastOptions={{ duration: 2000 }} />
    </>
  )
}

export default App
