import ListStudent from "./components/ListStudent";
import Student from "./students.json";

export default function App() {
  // localStorage.setItem("students", JSON.stringify(Student));
  return (
    <>
      <ListStudent />
    </>
  );
}
