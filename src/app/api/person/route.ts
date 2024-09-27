import type { Person } from "@/types";
import { NextRequest } from "next/server";


const people: Person[] = [
  { id: 1, name: 'Durwald Reynolds' },
  { id: 2, name: 'Kenton Towne' },
  { id: 3, name: 'Therese Wunsch' },
  { id: 4, name: 'Benedict Kessler' },
  { id: 5, name: 'Katelyn Rohan' },
]

export async function GET(
  req: NextRequest,
) {
  const searchParams = req.nextUrl.searchParams;
  const query = searchParams.get('q') ?? ''


  const filteredPeople = query === '' ? people : people.filter((person) => person.name.toLowerCase().startsWith(query.toLowerCase()))

  return Response.json(filteredPeople)
}
