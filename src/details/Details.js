import { useParams } from "react-router-dom"

export default function Details() {

  const params = useParams();
  const id = params.id;

    return (
        <div>
            <h1>Details</h1>
            <div> {id} </div>
        </div>
    )
}